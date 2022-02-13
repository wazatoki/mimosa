import { v4 as uuidv4 } from 'uuid'

export function createUUID() {

    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var h = ("00" + dt.getHours()).slice(-2);
    var mm = ("00"+ dt.getMinutes()).slice(-2);
    var s = ("00"+ dt.getSeconds()).slice(-2);
    var sss = ("000"+ dt.getMilliseconds()).slice(-3);

    return y+m+d+h+mm+s+sss+uuidv4()
}
