# Listino di potenza SB-10a — misure

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `classpath:/sb-10a/listino-base.json` |
| SHA-256 | `87fa95f18772385258c51c05de784487beb4fa0dc9a67062d6783fff35b7b1b1` |
| Misure | tetto |
| Stili | aggressivo, prudente, risorse, stesso stile sui due lati salvo dove indicato |
| Bisezione | 400 partite per stile e punto, semi da 8000000 |
| Griglia | 5 punti, 2000 partite per stile e punto, semi da 8500000 (disgiunti) |
| Curve | 2000 partite per stile e cella, semi da 8200000 |
| Tempi | nel file `.tempi.txt` accanto |

Quota: vittorie / (vittorie + sconfitte) del mazzo sonda, patte escluse, Wilson al 95%. Punto di indifferenza: radice della retta pesata fra quota e x sulla griglia, intervallo al 95% col metodo delta (bersaglio compreso nei non specchi). Ogni bozza derivata ha il suo SHA-256 nel file di dati. I valori misurano come giocano **questi bot**.

## Tetto delle bound contro il manichino

Parametri: 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1.

| bound | personaggio | valore per uso (medio / massimo) | danno | parato | guadagni pesati | viola | motivi |
|---|---|---:|---:|---:|---:|---|---|
| bruiser.character.LittleRage | bruiser.character.BigBadBruiser | 6,75 / 6,75 | 0,00 | 3,00 | 3,75 | sì | valore per uso 6,75 oltre il tetto 4,00 |
| bruiser.character.LittleSmack | bruiser.character.BigBadBruiser | 7,50 / 7,50 | 5,00 | 0,00 | 2,50 | sì | valore per uso 7,50 oltre il tetto 4,00 |
| junkie.character.PatheticBlade | junkie.character.ToxicJunkie | 16,75 / 25,75 | 16,00 | 0,00 | 0,75 | sì | valore per uso 25,75 oltre il tetto 4,00; si accumula: danno 7,00 al primo uso, 25,00 all'uso 8; resta sull'avversario: T +40 |
| junkie.character.RottenSmile | junkie.character.ToxicJunkie | 2,50 / 2,50 | 0,00 | 0,00 | 2,50 | sì | resta sull'avversario: A -40 |
| listino.bound.danno-10-mara | prova.mara | 10,00 / 10,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 10,00 oltre il tetto 4,00 |
| listino.bound.danno-10-neutro | sonda.neutro | 10,00 / 10,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 10,00 oltre il tetto 4,00 |
| listino.bound.danno-10-spazienzio | bruiser.character.BigBadBruiser | 10,00 / 10,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 10,00 oltre il tetto 4,00 |
| listino.bound.danno-2-mara | prova.mara | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-2-neutro | sonda.neutro | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-2-spazienzio | bruiser.character.BigBadBruiser | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-4-mara | prova.mara | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-4-neutro | sonda.neutro | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-4-spazienzio | bruiser.character.BigBadBruiser | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-6-mara | prova.mara | 6,00 / 6,00 | 6,00 | 0,00 | 0,00 | sì | valore per uso 6,00 oltre il tetto 4,00 |
| listino.bound.danno-6-neutro | sonda.neutro | 6,00 / 6,00 | 6,00 | 0,00 | 0,00 | sì | valore per uso 6,00 oltre il tetto 4,00 |
| listino.bound.danno-6-spazienzio | bruiser.character.BigBadBruiser | 6,00 / 6,00 | 6,00 | 0,00 | 0,00 | sì | valore per uso 6,00 oltre il tetto 4,00 |
| listino.bound.danno-8-mara | prova.mara | 8,00 / 8,00 | 8,00 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00 |
| listino.bound.danno-8-neutro | sonda.neutro | 8,00 / 8,00 | 8,00 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00 |
| listino.bound.danno-8-spazienzio | bruiser.character.BigBadBruiser | 8,00 / 8,00 | 8,00 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00 |
| listino.bound.parata-0.25-mara | prova.mara | 8,00 / 8,00 | 0,00 | 8,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00 |
| listino.bound.parata-0.25-neutro | sonda.neutro | 8,00 / 8,00 | 0,00 | 8,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00 |
| listino.bound.parata-0.25-spazienzio | bruiser.character.BigBadBruiser | 8,00 / 8,00 | 0,00 | 8,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00 |
| listino.bound.parata-0.5-mara | prova.mara | 5,00 / 5,00 | 0,00 | 5,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| listino.bound.parata-0.5-neutro | sonda.neutro | 5,00 / 5,00 | 0,00 | 5,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| listino.bound.parata-0.5-spazienzio | bruiser.character.BigBadBruiser | 5,00 / 5,00 | 0,00 | 5,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| listino.bound.parata-0.75-mara | prova.mara | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
| listino.bound.parata-0.75-neutro | sonda.neutro | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
| listino.bound.parata-0.75-spazienzio | bruiser.character.BigBadBruiser | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
| listino.bound.risorsa-10-mara | prova.mara | 5,00 / 5,00 | 0,00 | 0,00 | 5,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| listino.bound.risorsa-10-neutro | sonda.neutro | 7,50 / 7,50 | 0,00 | 0,00 | 7,50 | sì | valore per uso 7,50 oltre il tetto 4,00 |
| listino.bound.risorsa-10-spazienzio | bruiser.character.BigBadBruiser | 7,50 / 7,50 | 0,00 | 0,00 | 7,50 | sì | valore per uso 7,50 oltre il tetto 4,00 |
| listino.bound.risorsa-2-mara | prova.mara | 1,00 / 1,00 | 0,00 | 0,00 | 1,00 | no |  |
| listino.bound.risorsa-2-neutro | sonda.neutro | 1,50 / 1,50 | 0,00 | 0,00 | 1,50 | no |  |
| listino.bound.risorsa-2-spazienzio | bruiser.character.BigBadBruiser | 1,50 / 1,50 | 0,00 | 0,00 | 1,50 | no |  |
| listino.bound.risorsa-4-mara | prova.mara | 2,00 / 2,00 | 0,00 | 0,00 | 2,00 | no |  |
| listino.bound.risorsa-4-neutro | sonda.neutro | 3,00 / 3,00 | 0,00 | 0,00 | 3,00 | no |  |
| listino.bound.risorsa-4-spazienzio | bruiser.character.BigBadBruiser | 3,00 / 3,00 | 0,00 | 0,00 | 3,00 | no |  |
| listino.bound.risorsa-6-mara | prova.mara | 3,00 / 3,00 | 0,00 | 0,00 | 3,00 | no |  |
| listino.bound.risorsa-6-neutro | sonda.neutro | 4,50 / 4,50 | 0,00 | 0,00 | 4,50 | sì | valore per uso 4,50 oltre il tetto 4,00 |
| listino.bound.risorsa-6-spazienzio | bruiser.character.BigBadBruiser | 4,50 / 4,50 | 0,00 | 0,00 | 4,50 | sì | valore per uso 4,50 oltre il tetto 4,00 |
| listino.bound.risorsa-8-mara | prova.mara | 4,00 / 4,00 | 0,00 | 0,00 | 4,00 | no |  |
| listino.bound.risorsa-8-neutro | sonda.neutro | 6,00 / 6,00 | 0,00 | 0,00 | 6,00 | sì | valore per uso 6,00 oltre il tetto 4,00 |
| listino.bound.risorsa-8-spazienzio | bruiser.character.BigBadBruiser | 6,00 / 6,00 | 0,00 | 0,00 | 6,00 | sì | valore per uso 6,00 oltre il tetto 4,00 |
| listino.bound.struggle-mara | prova.mara | 5,00 / 5,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| listino.bound.struggle-neutro | sonda.neutro | 5,00 / 5,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| listino.bound.struggle-spazienzio | bruiser.character.BigBadBruiser | 5,00 / 5,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| listino.bound.veleno-2-mara | prova.mara | 4,50 / 8,00 | 4,50 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00; si accumula: danno 1,00 al primo uso, 8,00 all'uso 8; resta sull'avversario: T +16 |
| listino.bound.veleno-2-neutro | sonda.neutro | 4,50 / 8,00 | 4,50 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00; si accumula: danno 1,00 al primo uso, 8,00 all'uso 8; resta sull'avversario: T +16 |
| listino.bound.veleno-2-spazienzio | bruiser.character.BigBadBruiser | 4,50 / 8,00 | 4,50 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 4,00; si accumula: danno 1,00 al primo uso, 8,00 all'uso 8; resta sull'avversario: T +16 |
| listino.bound.veleno-5-mara | prova.mara | 11,00 / 20,00 | 11,00 | 0,00 | 0,00 | sì | valore per uso 20,00 oltre il tetto 4,00; si accumula: danno 2,00 al primo uso, 20,00 all'uso 8; resta sull'avversario: T +40 |
| listino.bound.veleno-5-neutro | sonda.neutro | 11,00 / 20,00 | 11,00 | 0,00 | 0,00 | sì | valore per uso 20,00 oltre il tetto 4,00; si accumula: danno 2,00 al primo uso, 20,00 all'uso 8; resta sull'avversario: T +40 |
| listino.bound.veleno-5-spazienzio | bruiser.character.BigBadBruiser | 11,00 / 20,00 | 11,00 | 0,00 | 0,00 | sì | valore per uso 20,00 oltre il tetto 4,00; si accumula: danno 2,00 al primo uso, 20,00 all'uso 8; resta sull'avversario: T +40 |
| prova.mara.ColpoDiStriscio | prova.mara | 5,00 / 5,00 | 5,00 | 0,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| prova.mara.Scarto | prova.mara | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
| prova.rocco.Colpetto | prova.rocco | 5,00 / 5,00 | 5,00 | 0,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| prova.rocco.Fiato | prova.rocco | 5,00 / 5,00 | 0,00 | 0,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| sonda.neutro.Colpetto | sonda.neutro | 5,00 / 5,00 | 5,00 | 0,00 | 0,00 | sì | valore per uso 5,00 oltre il tetto 4,00 |
| sonda.neutro.Riparo | sonda.neutro | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
