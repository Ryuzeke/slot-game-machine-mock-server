import { SYMBOLS } from '../enums'
import { hashJson } from '../utils/hasher'

function generateHashTableWinRules(winRules){
    var hashTable = {}
    winRules.forEach(winRule => {
        hashTable[hashJson(winRule.symbols)] = winRule
    });
    return hashTable;
}


const AllWinRules = [
    {type: 'payline', symbols:[SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01], wins: {payline_bet_multiplier: 5}}, 
]
export default {
    name: 'ryuzeke-slot',
    reels: [
        [SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM05,SYMBOLS.SYM01,SYMBOLS.SYM02,SYMBOLS.SYM03],
        [SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM05,SYMBOLS.SYM01,SYMBOLS.SYM02,SYMBOLS.SYM03],
        [SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM01,SYMBOLS.SYM05,SYMBOLS.SYM01,SYMBOLS.SYM02,SYMBOLS.SYM03]
    ],
    columns: 3,
    paylines: [
        [0,0,0],
        [1,1,1],
        [2,2,2],
    ],
    win_rules: generateHashTableWinRules(AllWinRules),
    // symbols: [ // future use for wild symbols_includes = [multiple symbols]
    //     {id: SYMBOLS.SYM01, symbols_includes: [SYMBOLS.SYM01]},
    //     {id: SYMBOLS.SYM02, symbols_includes: [SYMBOLS.SYM02]},
    //     {id: SYMBOLS.SYM03, symbols_includes: [SYMBOLS.SYM03]},
    //     {id: SYMBOLS.SYM04, symbols_includes: [SYMBOLS.SYM04]},
    //     {id: SYMBOLS.SYM05, symbols_includes: [SYMBOLS.SYM05]}
    // ]
}