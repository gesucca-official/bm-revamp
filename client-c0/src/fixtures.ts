// Generato da tools/fixtures.py; testi dal catalogo, art esclusa.
import {View} from "./contracts";
export const fixtures = {
  "before": {
    "gameId": "c0-synthetic-ffa",
    "players": {
      "Ada": {
        "playerId": "Ada",
        "cardsInHand": [
          {
            "name": "ADOPERIAMOTI",
            "bindingName": "com.basic.BruiserGrab",
            "effect": "<p>Basic Action <i>(you can always do this if its conditions are met)</i></p><p>Slow Move <i>(others act first when you are doing this)</i></p><p>Basic: consuma come Grab. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": true,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": -1,
            "canTarget": [
              "NEAR_ITEM"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "SVEGLIAMOCI MA TU NO",
            "bindingName": "bruiser.character.LittleSmack",
            "effect": "<p>Fallback Move <i>(discard another card instead of this)</i></p><p>+5 A a sé; 5 HIT al bersaglio. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": true,
            "boundToCharacter": "bruiser.character.BigBadBruiser",
            "priority": 1,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "COSA FAI NON É UNA DOMANDA",
            "bindingName": "bruiser.WhatchaDoin",
            "effect": "<p>Quick Move <i>(you act first than others when doing this)</i></p><p>Annulla mossa successiva e ne esegue solo l'effetto target usando sé come autore; non replica self, costi, logica speciale. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 2,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 10,
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "Steal",
            "bindingName": "com.Steal",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>Trasferisce l'oggetto vicino a sé senza consumarlo. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "FAR_ITEM"
            ],
            "cost": {
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          }
        ],
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [],
          "resources": {
            "HEALTH": 120,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [
            {
              "name": "MADE OF STONE",
              "description": "Cut Damage Taken: x0.5",
              "type": "GOOD",
              "flow": "INPUT",
              "impactedProperty": "CUT",
              "lastsForTurns": 3,
              "equip": false,
              "singleUse": false,
              "amountFunction": {},
              "typeFunction": {}
            }
          ],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Bice": {
        "playerId": "Bice",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            },
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            },
            {
              "name": "Mescolone Micidiale",
              "bindingName": "com.items.MarvelousCocktail",
              "effect": "<p>Immunità T e L; +20 L e +20 T; timer 5 cancella tutte le immunità e gli stati, poi 20 POISON. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [
            "TOXICITY"
          ],
          "timers": [],
          "sprite": null
        }
      },
      "Ciro": {
        "playerId": "Ciro",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [
            {
              "name": "Tennents Super",
              "bindingName": "com.items.AnotherRottenBeer",
              "effect": "<p>Crea BrokenBeerBottle vicino a sé; +10 L. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Dado": {
        "playerId": "Dado",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [],
          "timers": [
            {
              "name": "Bad Trip",
              "timer": 2,
              "callback": {}
            }
          ],
          "sprite": null
        }
      },
      "Enea": {
        "playerId": "Enea",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      }
    },
    "resolvedMoves": [],
    "timeBasedEffects": {},
    "over": false,
    "winner": "NONE",
    "turn": 7,
    "pendingMove": null,
    "forfeits": {},
    "moveDeadlines": {
      "Ada": 1893456030000,
      "Bice": 1893456030000,
      "Ciro": 1893456030000,
      "Dado": 1893456030000,
      "Enea": 1893456030000
    },
    "reconnectDeadlines": {},
    "outcomeReason": null
  },
  "after": {
    "gameId": "c0-synthetic-ffa",
    "players": {
      "Ada": {
        "playerId": "Ada",
        "cardsInHand": [
          {
            "name": "ADOPERIAMOTI",
            "bindingName": "com.basic.BruiserGrab",
            "effect": "<p>Basic Action <i>(you can always do this if its conditions are met)</i></p><p>Slow Move <i>(others act first when you are doing this)</i></p><p>Basic: consuma come Grab. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": true,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": -1,
            "canTarget": [
              "NEAR_ITEM"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "SVEGLIAMOCI MA TU NO",
            "bindingName": "bruiser.character.LittleSmack",
            "effect": "<p>Fallback Move <i>(discard another card instead of this)</i></p><p>+5 A a sé; 5 HIT al bersaglio. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": true,
            "boundToCharacter": "bruiser.character.BigBadBruiser",
            "priority": 1,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "COSA FAI NON É UNA DOMANDA",
            "bindingName": "bruiser.WhatchaDoin",
            "effect": "<p>Quick Move <i>(you act first than others when doing this)</i></p><p>Annulla mossa successiva e ne esegue solo l'effetto target usando sé come autore; non replica self, costi, logica speciale. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 2,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 10,
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "Steal",
            "bindingName": "com.Steal",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>Trasferisce l'oggetto vicino a sé senza consumarlo. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "FAR_ITEM"
            ],
            "cost": {
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          }
        ],
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 80,
            "ALERTNESS": 10,
            "VIOLENCE": 25
          },
          "statuses": [
            {
              "name": "MADE OF STONE",
              "description": "Cut Damage Taken: x0.5",
              "type": "GOOD",
              "flow": "INPUT",
              "impactedProperty": "CUT",
              "lastsForTurns": 2,
              "equip": false,
              "singleUse": false,
              "amountFunction": {},
              "typeFunction": {}
            }
          ],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Bice": {
        "playerId": "Bice",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            },
            {
              "name": "Mescolone Micidiale",
              "bindingName": "com.items.MarvelousCocktail",
              "effect": "<p>Immunità T e L; +20 L e +20 T; timer 5 cancella tutte le immunità e gli stati, poi 20 POISON. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [
            "TOXICITY"
          ],
          "timers": [],
          "sprite": null
        }
      },
      "Ciro": {
        "playerId": "Ciro",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [
            {
              "name": "Tennents Super",
              "bindingName": "com.items.AnotherRottenBeer",
              "effect": "<p>Crea BrokenBeerBottle vicino a sé; +10 L. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Dado": {
        "playerId": "Dado",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [],
          "timers": [
            {
              "name": "Bad Trip",
              "timer": 2,
              "callback": {}
            }
          ],
          "sprite": null
        }
      },
      "Enea": {
        "playerId": "Enea",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      }
    },
    "resolvedMoves": [
      {
        "playedCardName": "Steal",
        "playerId": "Ada",
        "targetId": "Bice",
        "gameId": "c0-synthetic-ffa",
        "choices": {
          "TARGET_ITEM": "Peroni da 66, calda"
        },
        "void": false,
        "moveReport": {
          "SELF": [
            "Stolen Peroni da 66, calda from Bice"
          ]
        }
      },
      {
        "playedCardName": "GARGANTUESCO IMPATTO SUL TU",
        "playerId": "Ciro",
        "targetId": "Ada",
        "gameId": "c0-synthetic-ffa",
        "choices": null,
        "void": false,
        "moveReport": {
          "OPPONENT": [
            "Lost 40 HEALTH"
          ]
        }
      }
    ],
    "timeBasedEffects": {},
    "over": false,
    "winner": "NONE",
    "turn": 8,
    "pendingMove": null,
    "forfeits": {},
    "moveDeadlines": {
      "Ada": 1893456060000,
      "Bice": 1893456060000,
      "Ciro": 1893456060000,
      "Dado": 1893456060000,
      "Enea": 1893456060000
    },
    "reconnectDeadlines": {},
    "outcomeReason": null
  },
  "pending": {
    "gameId": "c0-synthetic-ffa",
    "players": {
      "Ada": {
        "playerId": "Ada",
        "cardsInHand": [
          {
            "name": "ADOPERIAMOTI",
            "bindingName": "com.basic.BruiserGrab",
            "effect": "<p>Basic Action <i>(you can always do this if its conditions are met)</i></p><p>Slow Move <i>(others act first when you are doing this)</i></p><p>Basic: consuma come Grab. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": true,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": -1,
            "canTarget": [
              "NEAR_ITEM"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "SVEGLIAMOCI MA TU NO",
            "bindingName": "bruiser.character.LittleSmack",
            "effect": "<p>Fallback Move <i>(discard another card instead of this)</i></p><p>+5 A a sé; 5 HIT al bersaglio. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": true,
            "boundToCharacter": "bruiser.character.BigBadBruiser",
            "priority": 1,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "COSA FAI NON É UNA DOMANDA",
            "bindingName": "bruiser.WhatchaDoin",
            "effect": "<p>Quick Move <i>(you act first than others when doing this)</i></p><p>Annulla mossa successiva e ne esegue solo l'effetto target usando sé come autore; non replica self, costi, logica speciale. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 2,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 10,
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "Steal",
            "bindingName": "com.Steal",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>Trasferisce l'oggetto vicino a sé senza consumarlo. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "FAR_ITEM"
            ],
            "cost": {
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          }
        ],
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [],
          "resources": {
            "HEALTH": 120,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [
            {
              "name": "MADE OF STONE",
              "description": "Cut Damage Taken: x0.5",
              "type": "GOOD",
              "flow": "INPUT",
              "impactedProperty": "CUT",
              "lastsForTurns": 3,
              "equip": false,
              "singleUse": false,
              "amountFunction": {},
              "typeFunction": {}
            }
          ],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Bice": {
        "playerId": "Bice",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            },
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            },
            {
              "name": "Mescolone Micidiale",
              "bindingName": "com.items.MarvelousCocktail",
              "effect": "<p>Immunità T e L; +20 L e +20 T; timer 5 cancella tutte le immunità e gli stati, poi 20 POISON. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [
            "TOXICITY"
          ],
          "timers": [],
          "sprite": null
        }
      },
      "Ciro": {
        "playerId": "Ciro",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [
            {
              "name": "Tennents Super",
              "bindingName": "com.items.AnotherRottenBeer",
              "effect": "<p>Crea BrokenBeerBottle vicino a sé; +10 L. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Dado": {
        "playerId": "Dado",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [],
          "timers": [
            {
              "name": "Bad Trip",
              "timer": 2,
              "callback": {}
            }
          ],
          "sprite": null
        }
      },
      "Enea": {
        "playerId": "Enea",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      }
    },
    "resolvedMoves": [],
    "timeBasedEffects": {},
    "over": false,
    "winner": "NONE",
    "turn": 7,
    "pendingMove": {
      "playedCardName": "Steal",
      "playerId": "Ada",
      "targetId": "Bice",
      "gameId": "c0-synthetic-ffa",
      "choices": {
        "TARGET_ITEM": "Peroni da 66, calda"
      },
      "void": false,
      "moveReport": {}
    },
    "forfeits": {},
    "moveDeadlines": {
      "Bice": 1893456030000,
      "Ciro": 1893456030000,
      "Dado": 1893456030000,
      "Enea": 1893456030000
    },
    "reconnectDeadlines": {},
    "outcomeReason": null
  },
  "clock": {
    "gameId": "c0-synthetic-ffa",
    "players": {
      "Ada": {
        "playerId": "Ada",
        "cardsInHand": [
          {
            "name": "ADOPERIAMOTI",
            "bindingName": "com.basic.BruiserGrab",
            "effect": "<p>Basic Action <i>(you can always do this if its conditions are met)</i></p><p>Slow Move <i>(others act first when you are doing this)</i></p><p>Basic: consuma come Grab. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": true,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": -1,
            "canTarget": [
              "NEAR_ITEM"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "SVEGLIAMOCI MA TU NO",
            "bindingName": "bruiser.character.LittleSmack",
            "effect": "<p>Fallback Move <i>(discard another card instead of this)</i></p><p>+5 A a sé; 5 HIT al bersaglio. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": true,
            "boundToCharacter": "bruiser.character.BigBadBruiser",
            "priority": 1,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "COSA FAI NON É UNA DOMANDA",
            "bindingName": "bruiser.WhatchaDoin",
            "effect": "<p>Quick Move <i>(you act first than others when doing this)</i></p><p>Annulla mossa successiva e ne esegue solo l'effetto target usando sé come autore; non replica self, costi, logica speciale. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 2,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 10,
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "Steal",
            "bindingName": "com.Steal",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>Trasferisce l'oggetto vicino a sé senza consumarlo. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "FAR_ITEM"
            ],
            "cost": {
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          }
        ],
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [],
          "resources": {
            "HEALTH": 120,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [
            {
              "name": "MADE OF STONE",
              "description": "Cut Damage Taken: x0.5",
              "type": "GOOD",
              "flow": "INPUT",
              "impactedProperty": "CUT",
              "lastsForTurns": 3,
              "equip": false,
              "singleUse": false,
              "amountFunction": {},
              "typeFunction": {}
            }
          ],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Bice": {
        "playerId": "Bice",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            },
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            },
            {
              "name": "Mescolone Micidiale",
              "bindingName": "com.items.MarvelousCocktail",
              "effect": "<p>Immunità T e L; +20 L e +20 T; timer 5 cancella tutte le immunità e gli stati, poi 20 POISON. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [
            "TOXICITY"
          ],
          "timers": [],
          "sprite": null
        }
      },
      "Ciro": {
        "playerId": "Ciro",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [
            {
              "name": "Tennents Super",
              "bindingName": "com.items.AnotherRottenBeer",
              "effect": "<p>Crea BrokenBeerBottle vicino a sé; +10 L. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Dado": {
        "playerId": "Dado",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [],
          "timers": [
            {
              "name": "Bad Trip",
              "timer": 2,
              "callback": {}
            }
          ],
          "sprite": null
        }
      },
      "Enea": {
        "playerId": "Enea",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      }
    },
    "resolvedMoves": [],
    "timeBasedEffects": {},
    "over": false,
    "winner": "NONE",
    "turn": 7,
    "pendingMove": null,
    "forfeits": {},
    "moveDeadlines": {
      "Ada": 1893456030000,
      "Bice": 1893456030000,
      "Ciro": 1893456030000,
      "Dado": 1893456030000,
      "Enea": 1893456030000
    },
    "reconnectDeadlines": {
      "Dado": 1893456020000
    },
    "outcomeReason": null
  },
  "edge": {
    "gameId": "c0-synthetic-ffa",
    "players": {
      "Ada": {
        "playerId": "Ada",
        "cardsInHand": [
          {
            "name": "ADOPERIAMOTI",
            "bindingName": "com.basic.BruiserGrab",
            "effect": "<p>Basic Action <i>(you can always do this if its conditions are met)</i></p><p>Slow Move <i>(others act first when you are doing this)</i></p><p>Basic: consuma come Grab. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": true,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": -1,
            "canTarget": [
              "NEAR_ITEM"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "SVEGLIAMOCI MA TU NO",
            "bindingName": "bruiser.character.LittleSmack",
            "effect": "<p>Fallback Move <i>(discard another card instead of this)</i></p><p>+5 A a sé; 5 HIT al bersaglio. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": true,
            "boundToCharacter": "bruiser.character.BigBadBruiser",
            "priority": 1,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {},
            "image": null,
            "sprite": null
          },
          {
            "name": "COSA FAI NON É UNA DOMANDA",
            "bindingName": "bruiser.WhatchaDoin",
            "effect": "<p>Quick Move <i>(you act first than others when doing this)</i></p><p>Annulla mossa successiva e ne esegue solo l'effetto target usando sé come autore; non replica self, costi, logica speciale. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 2,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 10,
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "Steal",
            "bindingName": "com.Steal",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>Trasferisce l'oggetto vicino a sé senza consumarlo. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "FAR_ITEM"
            ],
            "cost": {
              "ALERTNESS": 10
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          },
          {
            "name": "GARGANTUESCO IMPATTO SUL TU",
            "bindingName": "bruiser.SuperImpact",
            "effect": "<p>Slow Move <i>(others act first when you are doing this)</i></p><p>40 HIT. Riferimento: Regolamento 1.6, R02-R07.</p>",
            "item": false,
            "basicAction": false,
            "lastResort": false,
            "characterBound": false,
            "boundToCharacter": null,
            "priority": 0,
            "canTarget": [
              "OPPONENT"
            ],
            "cost": {
              "VIOLENCE": 25
            },
            "image": null,
            "sprite": null
          }
        ],
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 80,
            "ALERTNESS": 10,
            "VIOLENCE": 25
          },
          "statuses": [
            {
              "name": "MADE OF STONE",
              "description": "Cut Damage Taken: x0.5",
              "type": "GOOD",
              "flow": "INPUT",
              "impactedProperty": "CUT",
              "lastsForTurns": 2,
              "equip": false,
              "singleUse": false,
              "amountFunction": {},
              "typeFunction": {}
            }
          ],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Bice": {
        "playerId": "Bice",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [
            {
              "name": "Peroni da 66, calda",
              "bindingName": "com.items.RottenBeer",
              "effect": "<p>+5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            },
            {
              "name": "Mescolone Micidiale",
              "bindingName": "com.items.MarvelousCocktail",
              "effect": "<p>Immunità T e L; +20 L e +20 T; timer 5 cancella tutte le immunità e gli stati, poi 20 POISON. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [
            "TOXICITY"
          ],
          "timers": [],
          "sprite": null
        }
      },
      "Ciro": {
        "playerId": "Ciro",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": false,
          "itemsSize": 1,
          "items": [
            {
              "name": "Tennents Super",
              "bindingName": "com.items.AnotherRottenBeer",
              "effect": "<p>Crea BrokenBeerBottle vicino a sé; +10 L. Riferimento: Regolamento 1.6, R02-R07.</p>",
              "item": true,
              "basicAction": false,
              "lastResort": false,
              "characterBound": false,
              "boundToCharacter": null,
              "priority": 1,
              "canTarget": [
                "SELF"
              ],
              "cost": {},
              "image": null,
              "sprite": null
            }
          ],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      },
      "Dado": {
        "playerId": "Dado",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Tossico del Serraglio",
          "bindingName": "junkie.character.ToxicJunkie",
          "dead": false,
          "itemsSize": 3,
          "items": [],
          "resources": {
            "HEALTH": 100,
            "ALERTNESS": 35,
            "TOXICITY": 10
          },
          "statuses": [],
          "immunities": [],
          "timers": [
            {
              "name": "Bad Trip",
              "timer": 2,
              "callback": {}
            }
          ],
          "sprite": null
        }
      },
      "Enea": {
        "playerId": "Enea",
        "cardsInHand": 6,
        "deck": 12,
        "character": {
          "name": "Spazienzio de la Ucciso",
          "bindingName": "bruiser.character.BigBadBruiser",
          "dead": true,
          "itemsSize": 1,
          "items": [],
          "resources": {
            "HEALTH": -5,
            "ALERTNESS": 20,
            "VIOLENCE": 25
          },
          "statuses": [],
          "immunities": [],
          "timers": [],
          "sprite": null
        }
      }
    },
    "resolvedMoves": [
      {
        "playedCardName": "Steal",
        "playerId": "Ada",
        "targetId": "Bice",
        "gameId": "c0-synthetic-ffa",
        "choices": {
          "TARGET_ITEM": "Peroni da 66, calda"
        },
        "void": false,
        "moveReport": {
          "SELF": [
            "Stolen Peroni da 66, calda from Bice"
          ]
        }
      },
      {
        "playedCardName": "GARGANTUESCO IMPATTO SUL TU",
        "playerId": "Ciro",
        "targetId": "Ada",
        "gameId": "c0-synthetic-ffa",
        "choices": null,
        "void": false,
        "moveReport": {
          "OPPONENT": [
            "Lost 40 HEALTH"
          ]
        }
      }
    ],
    "timeBasedEffects": {},
    "over": false,
    "winner": "NONE",
    "turn": 8,
    "pendingMove": null,
    "forfeits": {
      "Dado": "leave"
    },
    "moveDeadlines": {
      "Ada": 1893456060000,
      "Bice": 1893456060000,
      "Ciro": 1893456060000
    },
    "reconnectDeadlines": {},
    "outcomeReason": null
  }
} satisfies Record<string, View>;
