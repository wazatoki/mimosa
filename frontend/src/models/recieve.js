
export class Recieve {
    id;
    name; //  取引先
    slipID; // 伝票NO
    slipDate; // 伝票日付
    items;

    constructor(id, name, slipID, slipDate){
        this.id = id;
        this.name = name;
        this.slipID = slipID;
        this.slipDate = slipDate;
        this.items = [];
    }
}

export class Item{
    id;
    item;
    receivingQuantity;

    constructor(id, item, receivingQuantity){
        this.id = id;
        this.item = item;
        this.receivingQuantity = receivingQuantity;
    }
}

export class ItemMST{
    id;
    name;
    receivingUnit;

    constructor(id, name, receivingUnit){
        this.id = id;
        this.name = name;
        this.receivingUnit = receivingUnit;
    }
}