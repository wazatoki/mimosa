export class Recipe {
    id
    name
    actDate
    stockLogs // 払い出し材料データ

    constructor(name, actDate) {
        this.id = "";
        this.name = name;
        this.actDate = actDate || new Date("1970", "1", "1");
    }
};