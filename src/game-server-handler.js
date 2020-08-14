import { handshakeHandler, playgameHandler, collectHandler } from './handlers'
import configs from './config'
import messageParser from './utils/message-parser'
import UserDbClassMock from './mocks/users_db'
var shared = { configs }
shared.UserDbClassMock = new UserDbClassMock(shared);

export default (connection, req) => {
    connection.socket.on('message', message => {
        const messageParsed = messageParser(message);
        if(!messageParsed) return;
        var answer = {};
        var handlerObj = {connection, req, bodyOfMessage:messageParsed.body, shared}
        switch (messageParsed.request) {
            case 'handshake':
                answer.body = handshakeHandler(handlerObj);
                break;
            case 'playgame':
                answer.body = playgameHandler(handlerObj);
                break;
            case 'collect':
                answer.body = collectHandler(handlerObj);
                break;
            default:
                break;
        }
        answer.request = messageParsed.request
        answer = JSON.stringify(answer);
        connection.socket.send(answer)
    })
}