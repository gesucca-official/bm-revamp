"""Integration checks for future catalog growth and safe layout failures."""
import json
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from collections import Counter
from contextlib import closing

from generate import ROOT, load_catalog, starter_decks, select_starters


class GeneratorIntegrationTest(unittest.TestCase):
    def test_starter_selection_and_shared_quantities(self):
        cards, _, _, regular, initial = load_catalog(ROOT/'bm-server/src/main/resources/cards.sqlite', ROOT/'docs/game-rules.md', ROOT/'docs/rules-catalog.json')
        decks = starter_decks(cards, regular, initial)
        owners = list(decks)
        with tempfile.TemporaryDirectory() as directory:
            d = Path(directory)
            output = d/'starter.pdf'
            command = [sys.executable,str(Path(__file__).with_name('generate.py')),'--output',str(output)]
            for switches, selected in [(['--starter', owners[0].split('.')[-1]], [owners[0]]),
                                       (['--all-starters'], owners),
                                       (['--starter', owners[0], '--starter', owners[0], '--copies','2'], [owners[0]]*4)]:
                result = subprocess.run(command+switches,capture_output=True,text=True)
                self.assertEqual(result.returncode,0,result.stderr)
                m=json.loads(output.with_suffix('.manifest.json').read_text(encoding='utf-8'))
                expected=Counter()
                for owner in selected: expected.update(decks[owner])
                self.assertEqual(Counter(c['id'] for c in m['placements']),expected)
                self.assertTrue(all(not c.get('token') or not expected[c['id']] for c in cards))
            copies=d/'copies.json'
            copies.write_text('{"com.tokens.BrokenBeerBottle": 3, "com.last.Struggle": 0}',encoding='utf-8')
            result=subprocess.run(command+['--all-starters','--copies-file',str(copies)],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            m=json.loads(output.with_suffix('.manifest.json').read_text(encoding='utf-8'))
            printed=Counter(c['id'] for c in m['placements'])
            self.assertEqual(printed['com.tokens.BrokenBeerBottle'],3)
            self.assertEqual(printed['com.last.Struggle'],0)
            before=output.read_bytes()
            result=subprocess.run(command+['--starter','inesistente'],capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0)
            self.assertEqual(output.read_bytes(),before)
            result=subprocess.run(command+['--list-starters'],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            for owner in owners: self.assertIn(owner,result.stdout)
            self.assertEqual(output.read_bytes(),before)
        # Full names resolve too; collisions require the full stable identifier.
        by_id={c['id']:c for c in cards}
        self.assertEqual(select_starters([by_id[owners[0]]['name']],decks,cards),[owners[0]])
        ambiguous=[dict(c) for c in cards]
        for c in ambiguous:
            if c['id'] in owners: c['name']='stesso nome'
        with self.assertRaisesRegex(ValueError,'ambiguo'):
            select_starters(['stesso nome'],decks,ambiguous)

    def test_catalog_growth_and_missing_rules(self):
        with tempfile.TemporaryDirectory() as directory:
            d = Path(directory)
            db = d/'cards.sqlite'
            shutil.copyfile(ROOT/'bm-server/src/main/resources/cards.sqlite', db)
            with closing(sqlite3.connect(db)) as conn:
                conn.execute("insert into CRD001_GUI(C_REF_CLASS,T_GUI_NAME,T_GUI_DESCRIPTION) select 'com.NewGrab','Nuova carta fixture',T_GUI_DESCRIPTION from CRD001_GUI where C_REF_CLASS='com.Grab'")
                conn.execute("insert into CRD003_CHARACTERS(C_REF_CLASS,T_GUI_NAME) values ('fixture.NewHero','Nuovo eroe fixture')")
                conn.execute("insert into DCK001_STARTERS select 'fixture.NewHero',C_CRD_REF_CLASS,N_QTY from DCK001_STARTERS where C_PG_REF_CLASS='bruiser.character.BigBadBruiser'")
                conn.execute("insert into DCK002_STARTERS_CH select 'fixture.NewHero',T_BASIC_REF_CLASS,T_CH_BOUND_1_REF_CLASS,T_CH_BOUND_2_REF_CLASS,T_LAST_RESORT_REF_CLASS from DCK002_STARTERS_CH where C_PG_REF_CLASS='bruiser.character.BigBadBruiser'")
                conn.commit()
            annex = json.loads((ROOT/'docs/rules-catalog.json').read_text(encoding='utf-8'))
            n = dict(next(c for c in annex['cards'] if c['class']=='com.Grab'))
            n.update({'class':'com.NewGrab','name':'Nuova carta fixture'})
            annex['cards'].append(n)
            annex['characters'].append({'class':'fixture.NewHero','name':'Nuovo eroe fixture','type':'Personaggio'})
            ap = d/'annex.json'; ap.write_text(json.dumps(annex),encoding='utf-8')
            rules = (ROOT/'docs/game-rules.md').read_text(encoding='utf-8-sig')
            line = next(line for line in rules.splitlines() if line.startswith('| Grab |'))
            hero = next(line for line in rules.splitlines() if line.startswith('| BigBadBruiser |'))
            extended = rules.replace(line,line+'\n'+line.replace('| Grab |','| NewGrab |')).replace(hero,hero+'\n'+hero.replace('BigBadBruiser','NewHero').replace('Spazienzio de la Ucciso','Nuovo eroe fixture'))
            rp = d/'rules.md'; rp.write_text(extended,encoding='utf-8')
            output = d/'result.pdf'
            command = [sys.executable,str(Path(__file__).with_name('generate.py')),'--database',str(db),'--annex',str(ap),'--rules',str(rp),'--output',str(output)]
            result = subprocess.run(command,capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            m = json.loads(output.with_suffix('.manifest.json').read_text(encoding='utf-8'))
            self.assertIn('com.NewGrab',{c['id'] for c in m['inventory']})
            self.assertEqual(m['catalog_count'],len(annex['cards'])+len(annex['characters'])+len(annex['tokens']))
            for option in (['--starter','NewHero'],['--all-starters']):
                result=subprocess.run(command+option,capture_output=True,text=True)
                self.assertEqual(result.returncode,0,result.stderr)
                m=json.loads(output.with_suffix('.manifest.json').read_text(encoding='utf-8'))
                self.assertIn('fixture.NewHero',m['selection']['starters'])
                self.assertEqual(sum(p['id']=='fixture.NewHero' for p in m['placements']),1)
            result=subprocess.run(command+['--list-starters'],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            self.assertIn('fixture.NewHero',result.stdout)
            # Database-only additions must not be silently omitted or invented.
            rp.write_text(rules,encoding='utf-8')
            result = subprocess.run(command,capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0)
            self.assertIn('Inventario R07 diverso',result.stderr)

    def test_overflow_and_copy_selection(self):
        with tempfile.TemporaryDirectory() as directory:
            d = Path(directory)
            output=d/'result.pdf'
            command=[sys.executable,str(Path(__file__).with_name('generate.py')),'--output',str(output)]
            result=subprocess.run(command+['--width-mm','30','--height-mm','40'],capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0)
            self.assertFalse(output.exists())
            copies=d/'copies.json'; copies.write_text('{"com.Grab": 2}',encoding='utf-8')
            result=subprocess.run(command+['--copies','0','--copies-file',str(copies),'--width-mm','60','--height-mm','85'],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            m=json.loads(output.with_suffix('.manifest.json').read_text(encoding='utf-8'))
            self.assertEqual(m['printed_count'],2)
            self.assertEqual(m['trim_mm'],[60,85])
            self.assertEqual({c['id'] for c in m['placements']},{'com.Grab'})


if __name__=='__main__': unittest.main()
