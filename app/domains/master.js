export class StockItem {
    id
    name
    receivingUnit
    brewingUnit
    stockUnit
    baseUnit

    constructor() {
        this.id = "";
        this.name = "";
        this.receivingUnit = new StockUnit();
        this.brewingUnit = new StockUnit();
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
