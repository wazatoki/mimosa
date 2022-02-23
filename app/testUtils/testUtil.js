// parse 
export function compareObject(o, x) {
    for (let key in o) {
        if (typeof o[key] == 'object') {
            compareObject(o[key], x[key])
        } else {
            expect(o[key]).toBe(x[key]);
        }
    }
}