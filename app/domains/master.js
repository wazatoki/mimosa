export class StockItem {
    id
    name
    receivingUnit
    shippigUnit
    stockUnit
    baseUnit

    constructor() {
        this.id = "";
        this.name = "";
        this.receivingUnit = new StockUnit();
        this.shippigUnit = new StockUnit();
        this.stockUnit = new StockUnit();
        this.baseUnit = new StockUnit();
    }
};

export class StockUnit {
    id
    name
    conversionFactor

    constructor() {
        this.id = "";
        this.name = "";
        this.conversionFactor = 0;
    }
};
