export class Recipe {
    id
    name
    actDate

    constructor(name, actDate) {
        this.id = "";
        this.name = name;
        this.actDate = actDate || new Date("1970", "1", "1");
    }
};