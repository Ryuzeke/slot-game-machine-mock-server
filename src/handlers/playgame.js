
import { hashJson } from '../utils/hasher'
import { MESSAGES } from '../enums'
function bodyChecker(configs, body){
    try {
        if(!body.token)
            return false;
        if(!body.lines_count || body.lines_count > configs.public.paylines.length)
            return false;
        if(!body.bet_per_line || body.bet_per_line <= 0)
            return false;
        return true;
    } catch (err) {
        return false;
    }
}


function reelsRandomStopPosition(reelsArr){ 
    var stopPositions = []
    reelsArr.forEach(reelArr => {
        stopPositions.push(Math.floor(Math.random()*(reelArr.length)));
    });
    return stopPositions;
}

function getReelsSymbolsBasedOnStopPosition(reelsStopPositionArr,configPublic){
    let reelsSymbols = []
    reelsStopPositionArr.forEach((stopPosition, reelNumber) => {
        let symbols = []
        var i = 0
        var original_step = -1;
        while(i<configPublic.columns){
            var currentStopPosition = stopPosition+i
            var symbol = configPublic.reels[reelNumber][currentStopPosition];
            if(!symbol){
                var newIndex = i-1-original_step % configPublic.reels[reelNumber].length;
                symbol = configPublic.reels[reelNumber][newIndex]
            } else {
                original_step++
            }
            symbols.push(symbol)
            i++
        }
        reelsSymbols.push(symbols)
    });
    return reelsSymbols;
}

function calculatePaylineWins(reelsStopPositionArr, linesCount, publicConfig){
    const reelsSymbols = getReelsSymbolsBasedOnStopPosition(reelsStopPositionArr,publicConfig);
    var paylines_won = {}
    for(var i=0; i<publicConfig.paylines.length; i++){
        var payline = publicConfig.paylines[i]
        if(i > linesCount-1)
            break;
        var symbols_at_payline = []
        payline.forEach((column,row) => {
            symbols_at_payline.push(reelsSymbols[row][column])
        });
        var hashedString = hashJson(symbols_at_payline)
        if(publicConfig.win_rules[hashedString]){
            paylines_won[i] = publicConfig.win_rules[hashedString]
        }
    }
    // publicConfig.paylines.forEach((payline,index) => {
    //     var symbols_at_payline = []
    //     payline.forEach((column,row) => {
    //         symbols_at_payline.push(reelsSymbols[row][column])
    //     });
    //     var hashedString = hashJson(symbols_at_payline)
    //     if(publicConfig.win_rules[hashedString]){
    //         paylines_won[index] = publicConfig.win_rules[hashedString]
    //     }
    // });
    return paylines_won;
}

function caclulateTotalWins(paylines_won,betPerLine){
    var total_wins = {
        amount_won: 0
    }
    for (const [paylineId, paylineWinObj] of Object.entries(paylines_won)) {
        total_wins.amount_won += (paylineWinObj.wins.payline_bet_multiplier || 0) * betPerLine
    }
    return total_wins;
}

export default ({req, connection, bodyOfMessage, shared})=>{
    var answer = {
        user_information: null,
        reels_stop_position: null,
        wins: null,
        sucess: false
    }
    if(!bodyChecker(shared.configs, bodyOfMessage)){
        connection.socket.close();
    }
    const totalBet = bodyOfMessage.bet_per_line * bodyOfMessage.lines_count;
    const reels_stop_position = reelsRandomStopPosition(shared.configs.public.reels)
    const paylines_won = calculatePaylineWins(reels_stop_position, bodyOfMessage.lines_count, shared.configs.public)
    const total_won = caclulateTotalWins(paylines_won, bodyOfMessage.bet_per_line)
    var user = shared.UserDbClassMock.getFakeUserDetailsWithToken(bodyOfMessage.token);
    if(!user){
        answer.reason = MESSAGES.ERROR.WRONG_TOKEN;
        return answer;
    }
    if(user.balance < totalBet){
        answer.reason = MESSAGES.ERROR.NOT_ENOUGH_BALANCE;
        return answer;
    }
    user.balance -= totalBet;
    user.await_to_collect += total_won.amount_won
    answer.user_information = user
    answer.reels_stop_position = reels_stop_position;
    answer.wins = {
        paylines: paylines_won,
        total: total_won
    }
    answer.sucess = true;
    return answer;
}