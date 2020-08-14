export default class UserFakeDb{
    constructor(shared){
        this.users = {
            'user_token_here': { id: 1101, balance: 10000, await_to_collect:0 }
        }
    }

    getFakeUserDetailsWithToken(token){
        return this.users[token];
    }

    getFakeRandomUserTokenForAuth(){
        var tokens = Object.keys(this.users)
        const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
        return randomToken;
    }

    collectAwaitAmountWithToken(token){
        var user = this.users[token];
        if(!user) return false;
        user.balance += user.await_to_collect;
        user.await_to_collect = 0;
        return user.balance;
    }
}