import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {setup} from './browser.mjs';
import {expect} from '@playwright/test';
const app = await setup();
const results = [];
await mkdir('../docs/design/client-c0/screenshots',{recursive:true});
try {
  for (const sample of [{name:'desktop',width:1366,height:768,touch:false},{name:'touch-emulated',width:844,height:390,touch:true},{name:'portrait-emulated',width:390,height:844,touch:true}]) {
    const context = await app.browser.newContext({viewport:{width:sample.width,height:sample.height},hasTouch:sample.touch,isMobile:sample.touch});
    const page = await context.newPage();
    const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
    const requests=[]; page.on('request',r=>requests.push(r.url()));
    await page.goto(app.url); await page.locator('[data-card="5"]').waitFor();
    await page.locator('.lab-controls summary').click();
    const click = async locator => { if (sample.touch) await locator.tap(); else await locator.click(); await page.waitForTimeout(35); };
    assert.equal(await page.locator('.seat').count(),5);
    assert.equal(await page.locator('.card').count(),6);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true);
    // Tutte le carte, compresa la copia omonima, hanno un controllo distinto.
    for(let i=0;i<6;i++) { await click(page.locator(`[data-card="${i}"]`)); await expect(page.locator(`[data-card="${i}"]`)).toHaveAttribute('aria-pressed','true'); }
    await click(page.locator('[data-card="2"]'));
    assert.match(await page.locator('.full-text').innerText(),/non replica self, costi, logica speciale/);
    await click(page.locator('[data-target="Bice"]'));
    await click(page.getByTestId('confirm'));
    const command = await page.evaluate(()=>window.__c0.stats.lastCommand);
    assert.deepEqual(Object.keys(command).sort(),['choices','gameId','playedCardName','playerId','targetId']);
    assert.equal(command.choices,null); assert.equal(command.targetId,'Bice');
    assert.match(await page.getByTestId('phase').innerText(),/Invio in corso/);
    assert.equal(await page.getByTestId('confirm').isDisabled(),true);
    assert.match(await page.locator('#seat-Ada .resources').innerText(),/120/);
    await click(page.getByTestId('reject')); assert.equal(await page.getByTestId('confirm').isEnabled(),true);
    await click(page.getByTestId('reset'));
    await click(page.locator('[data-card="1"]')); await click(page.locator('[data-target="Bice"]'));
    assert.equal(await page.getByTestId('confirm').isDisabled(),true);
    assert.equal(await page.locator('#discard option').count(),5); // placeholder + quattro regolari, copie incluse
    await page.locator('#discard').selectOption({index:1}); await click(page.getByTestId('confirm'));
    assert.equal(typeof (await page.evaluate(()=>window.__c0.stats.lastCommand)).choices.DISCARD_ONE,'string');
    await click(page.getByTestId('reset'));
    await click(page.locator('[data-card="3"]'));
    await click(page.locator('[data-item-owner="Bice"][data-item-index="0"]'));
    await click(page.getByTestId('confirm'));
    const first = await page.evaluate(()=>window.__c0.stats.lastCommand);
    assert.equal(first.choices.TARGET_ITEM,'Peroni da 66, calda'); assert.equal(first.targetId,'Bice');
    await click(page.getByTestId('reject'));
    await click(page.locator('[data-item-owner="Bice"][data-item-index="1"]'));
    await click(page.getByTestId('confirm'));
    assert.deepEqual(await page.evaluate(()=>window.__c0.stats.lastCommand),first);
    await click(page.getByTestId('drop')); assert.equal(await page.getByTestId('confirm').isDisabled(),true);
    await click(page.getByTestId('pending')); assert.match(await page.getByTestId('phase').innerText(),/pending/);
    assert.equal(await page.getByTestId('confirm').isDisabled(),true);
    await click(page.getByTestId('reset'));
    // SELF viene scelto esplicitamente; non ci sono oggetti vicini all'inizio.
    await click(page.locator('[data-card="0"]')); assert.equal(await page.getByTestId('confirm').isDisabled(),true);
    // Nuova vista: annulla una sequenza attiva mantenendo il nodo con focus.
    await page.locator('[data-card="2"]').focus();
    await page.getByTestId('after').evaluate(el=>el.click()); await page.waitForTimeout(100);
    assert.ok(await page.locator('.fx').count());
    await page.getByTestId('after').evaluate(el=>el.click()); await page.waitForTimeout(30);
    assert.equal(await page.locator('.fx').count(),0);
    assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-card')),'2');
    assert.equal(await page.evaluate(()=>window.__c0.stats.sequences),1);
    assert.equal(await page.getByTestId('confirm').isDisabled(),true);
    await click(page.locator('[data-card="0"]')); await click(page.locator('[data-item-owner="Ada"]').first()); await click(page.getByTestId('confirm'));
    assert.equal((await page.evaluate(()=>window.__c0.stats.lastCommand)).targetId,'SELF');
    await click(page.getByTestId('reset')); await click(page.locator('[data-card="1"]')); await click(page.locator('[data-target="Bice"]'));
    await page.locator('#discard').selectOption({index:1}); await page.locator('#discard').focus();
    await page.getByTestId('clock').evaluate(el=>el.click());
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'discard');
    assert.equal(await page.getByTestId('confirm').isEnabled(),true);
    assert.match(await page.locator('#seat-Dado').innerText(),/Bad Trip/);
    await click(page.getByTestId('reset'));
    // Sequenza intera e poi cancellazione su resize, con input subito utilizzabile.
    await click(page.getByTestId('after')); await page.waitForTimeout(1000);
    const sequenceMs = await page.evaluate(()=>window.__c0.stats.sequenceMs.at(-1));
    assert.ok(sequenceMs > 700 && sequenceMs < 2000);
    await click(page.getByTestId('reset')); await click(page.getByTestId('after')); await page.waitForTimeout(60);
    await page.setViewportSize({width:sample.width-20,height:sample.height});
    await expect(page.locator('.fx')).toHaveCount(0);
    await page.setViewportSize({width:sample.width,height:sample.height});
    await click(page.getByTestId('reset'));
    await page.emulateMedia({reducedMotion:'reduce'});
    await click(page.getByTestId('after')); await page.waitForTimeout(100);
    assert.equal(await page.locator('.fx').count(),0);
    assert.match(await page.locator('#seat-Ada .resources').innerText(),/80/);
    await click(page.getByTestId('edge'));
    assert.match(await page.locator('#seat-Enea').innerText(),/-5/); assert.match(await page.locator('#seat-Dado').innerText(),/FORFAIT/);
    await click(page.locator('[data-card="4"]'));
    assert.equal(await page.locator('[data-target="Enea"]').isDisabled(),true);
    assert.equal(await page.locator('[data-target="Dado"]').isDisabled(),true);
    await page.getByTestId('reset').click();
    // Tastiera su controllo semantico, testo non dipendente dall'hover.
    await page.locator('[data-card="2"]').focus(); await page.keyboard.press('Enter');
    await expect(page.locator('[data-card="2"]')).toHaveAttribute('aria-pressed','true');
    await page.keyboard.press('Escape'); await expect(page.locator('.card.selected')).toHaveCount(0);
    await click(page.locator('[data-card="2"]')); await click(page.locator('[data-target="Bice"]'));
    await page.locator('.lab-controls summary').click();
    const geometry = await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth-innerWidth,
      cards:[...document.querySelectorAll('.card')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}),
      essential:[...document.querySelectorAll('.card,.target,.items button,.confirmation button,select')].map(e=>e.getBoundingClientRect().height),
      fullTextFont:getComputedStyle(document.querySelector('.full-text')).fontSize
    }));
    assert.ok(geometry.essential.every(h=>h>=44));
    await page.screenshot({path:`../docs/design/client-c0/screenshots/${sample.name}.png`,fullPage:true});
    assert.deepEqual(errors,[]); assert.ok(requests.every(r=>r.startsWith(app.url)));
    results.push({sample,pass:true,geometry,sequenceMs,checks:['6 carte e 5 partecipanti','testo lungo','ordinaria/bound/FAR_ITEM/NEAR_ITEM','duplicati identico comando','invio/rifiuto/pending/drop senza retry','cancellazione durante animazione e focus conservato','resize interrompe effetti','sequenza completa sotto 2 s','stesso turno aggiorna clock conservando scelta','nessun replay vista duplicata','movimento ridotto dal browser','H negativo/oltre 100, morto/forfait','tastiera Enter/Escape','target >=44 CSS px','nessuna richiesta esterna'],pageErrors:errors});
    await context.close();
  }
  await mkdir('../docs/reports/client-c0',{recursive:true});
  await writeFile('../docs/reports/client-c0/verification.json',JSON.stringify({date:new Date().toISOString(),browser:app.browser.version(),mode:'automazione headless, touch emulato',results},null,2)+'\n');
  console.log('PASS: tre viewport, percorsi sintetici e controlli DOM verificati.');
} finally {await app.close();}
