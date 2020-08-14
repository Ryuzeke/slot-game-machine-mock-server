export default ({req, connection, bodyOfMessage, shared})=>{
    var token = shared.UserDbClassMock.getFakeRandomUserTokenForAuth();
    return {
        config: shared.configs.public,
        token,
        success: true,
        user_information: shared.UserDbClassMock.getFakeUserDetailsWithToken(token)
    }
}