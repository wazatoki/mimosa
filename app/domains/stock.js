import { StockItem } from "./master"
import { StockRecieve } from './stockReceive'
import { Recipe } from './recipe'

export class Inventory {
    id
    actDate
    item
    quantity

    constructor(item, dt) {
        this.id = "";
        this.actDate = dt || new Date("1970", "1", "1");
        this.item = item || new StockItem();
        this.quantity = 0;
    }
}

export class StockLogEntity {
    id
    actDate
    item
    receivingQuantity
    brewingQuantity
    description
    type // 0: recieving, 1: brewing
    stockReceive
    recipe

    constructor() {
        this.id = ""
        this.actDate = new Date("1970", "1", "1")
        this.item = new StockItem()
        this.receivingQuantity = 0
        this.brewingQuantity = 0
        this.description = ""
        this.type = 0
        this.stockReceive = new StockRecieve();
        this.recipe = new Recipe();
    };
}

export class StockLog {
    stockLogs

    filterStockLogs(inventory, toDate) {

        return this.stockLogs
            .filter(logEntity => (logEntity.item.name === inventory.item.name && logEntity.actDate > inventory.actDate && logEntity.actDate <= toDate))
            .sort((a, b) => {
                if (a.actDate > b.actDate) {
                    return 1;
                }
                if (a.actDate < b.actDate) {
                    return -1;
                }
                if (a.type > b.type) {
                    return 1;
                }
                if (a.type < b.type) {
                    return -1;
                }
                return 0
            });
    }

    inventoryResult(inventory, toDate) {
        const receiving = this.stockLogs
            .filter(logEntity => (logEntity.item.name === inventory.item.name && logEntity.actDate > inventory.actDate && logEntity.actDate <= toDate))
            .reduce(function (sum, element) {
                return sum + element.receivingQuantity;
            }, 0);

        const brewing = this.stockLogs
            .filter(logEntity => (logEntity.item.name === inventory.item.name && logEntity.actDate > inventory.actDate && logEntity.actDate <= toDate))
            .reduce(function (sum, element) {
                return sum + element.brewingQuantity;
            }, 0);

        const result = (inventory.quantity * inventory.item.stockUnit.conversionFactor
            + receiving * inventory.item.receivingUnit.conversionFactor
            - brewing * inventory.item.brewingUnit.conversionFactor) / inventory.item.stockUnit.conversionFactor

        return result;
    }

    receivingSum(item, fromDate, toDate) {

        const result = this.stockLogs.filter(logEntity => (logEntity.item.name === item.name && logEntity.actDate >= fromDate && logEntity.actDate <= toDate))
            .reduce(function (sum, element) {
                return sum + element.receivingQuantity;
            }, 0);

        return result;
    }

    brewingSum(item, fromDate, toDate) {

        const result = this.stockLogs.filter(logEntity => (logEntity.item.name === item.name && logEntity.actDate >= fromDate && logEntity.actDate <= toDate))
            .reduce(function (sum, element) {
                return sum + element.brewingQuantity;
            }, 0);

        return result;
    }

    constructor(stockLogs) {
        this.stockLogs = stockLogs
    }
}