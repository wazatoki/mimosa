import { StockItem } from "./master"

export class Inventory {
    ID
    actDate
    item
    quantity
}

export class StockLogEntity {
    ID
    actDate
    item
    receivingQuantity
    shippingQuantity
    description

    constructor() {
        this.actDate = new Date("1970", "1", "1")
        this.item = new StockItem()
        this.receivingQuantity = 0
        this.shippingQuantity = 0
        this.description = ""
    };
}

export class StockLog {
    stockLogs

    inventoryResult(inventory, toDate) {

        var receiving
        var shipping
        var result

        receiving = this.stockLogs.filter(logEntity => (logEntity.item.name === inventory.item.name && logEntity.actDate > inventory.actDate && logEntity.actDate <= toDate))
            .reduce(function (sum, element) {
                return sum + element.receivingQuantity
            }, 0);

        shipping = this.stockLogs.filter(logEntity => (logEntity.item.name === inventory.item.name && logEntity.actDate > inventory.actDate && logEntity.actDate <= toDate))
            .reduce(function (sum, element) {
                return sum + element.shippingQuantity
            }, 0);

        result = (inventory.quantity
            + (receiving * inventory.item.receivingUnit.conversionFactor)
            - (shipping * inventory.item.shippigUnit.conversionFactor)) / item.stockUnit.conversionFactor

        return result
    }

    receivingSum(item, fromDate, toDate) {

        var result

        result = this.stockLogs.filter(logEntity => (logEntity.item.name === item.name && logEntity.actDate > fromDate && logEntity.actDate <= toDate))
            .reduce(function (sum, element) {
                return sum + element.receivingQuantity
            }, 0);

        return (result * item.receivingUnit.conversionFactor) / item.stockUnit.conversionFactor
    }

    shippingSum(item) {

        var result

        result = this.stockLogs.filter(logEntity => (logEntity.item.name === item.name && logEntity.actDate > fromDate && logEntity.actDate <= toDate))
            .reduce(function (sum, element) {
                return sum + element.shippingQuantity
            }, 0);

        return (result * item.shippigUnit.conversionFactor) / item.stockUnit.conversionFactor
    }

    constructor(stockLogs) {
        this.stockLogs = stockLogs
    }
}