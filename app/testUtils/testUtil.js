// parse 
export function compare(o, x) {
    for (let key in o) {
        if (typeof o[key] == 'object') {
            compare(o[key], x[key])
        } else {
            expect(o[key]).toBe(x[key]);
        }
    }
}