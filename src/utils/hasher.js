import sha1 from 'sha1'
export function hashJson(json){
    var stringfy = JSON.stringify(json)
    return sha1(stringfy);
}