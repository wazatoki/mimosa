import { v4 as uuidv4 } from 'uuid'

export function createUUID() {

    const dt = new Date();
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    const h = ("00" + dt.getHours()).slice(-2);
    const mm = ("00"+ dt.getMinutes()).slice(-2);
    const s = ("00"+ dt.getSeconds()).slice(-2);
    const sss = ("000"+ dt.getMilliseconds()).slice(-3);

    return y+m+d+h+mm+s+sss+uuidv4()
}
