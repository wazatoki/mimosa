export class StockItem {
    id
    name
    receivingUnit
    receivingUnitConversionFactor
    brewingUnit
    brewingUnitConversionFactor
    stockUnit
    stockUnitConversionFactor
    baseUnit

    constructor() {
        this.id = "";
        this.name = "";
        this.receivingUnit = new StockUnit();
        this.receivingUnitConversionFactor = 1;
        this.brewingUnit = new StockUnit();
        this.brewingUnitConversionFactor = 1;
        this.stockUnit = new StockUnit();
        this.stockUnitConversionFactor = 1;
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
    }
};
