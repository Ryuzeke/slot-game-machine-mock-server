export default (message)=>{
    var messageObj;
    try {
        messageObj = JSON.parse(message);
    } catch (e) {
        return false;
    }
    if(typeof messageObj.request !== 'string' && typeof messageObj.body !== 'object')
        return false;
    return messageObj;
}