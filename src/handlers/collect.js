function bodyChecker(configs, body){
    try {
        if(!body.token)
            return false;
        return true;
    } catch (err) {
        return false;
    }
}

export default ({req, connection, bodyOfMessage, shared})=>{
    if(!bodyChecker(shared.configs, bodyOfMessage)){
        connection.socket.close();
    }
    var answer = {current_balance: null,success: false}
    var userCollectCurrentBalance = shared.UserDbClassMock.collectAwaitAmountWithToken(bodyOfMessage.token)
    if(!userCollectCurrentBalance) return answer;

    answer.current_balance = userCollectCurrentBalance;
    answer.success = true;
    return answer;
}