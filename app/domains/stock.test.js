import { Inventory, StockLog, StockLogEntity } from "./stock";
import { createUUID } from "../utils/string";

test("StockLog filterStockLogs", () => {
    const logs = createStockLogs();
    const sl = new StockLog(logs);
    const inventory = new Inventory(logs[0].item, new Date(2020, 1, 1));
    inventory.quantity = 30;
    const result = sl.filterStockLogs(inventory, new Date(2020, 1, 31));
    const expected = [logs[3],logs[5],logs[4],logs[1]];
    expect(result).toEqual(expected);
});

test("StockLog inventoryResult", () => {
    const logs = createStockLogs()
    const sl = new StockLog(logs);
    const inventory = new Inventory(logs[0].item, new Date(2020, 1, 1));
    inventory.quantity = 30
    const result = sl.inventoryResult(inventory, new Date(2020, 1, 31))
    expect(result).toBe(50);
});

test("StockLog receivingSum", () => {
    const logs = createStockLogs()
    const sl = new StockLog(logs);
    const result = sl.receivingSum(logs[0].item, new Date(2020, 1, 1), new Date(2020, 1, 31))
    expect(result).toBe(40);
});

test("StockLog shippingSum", () => {
    const logs = createStockLogs()
    const sl = new StockLog(logs);
    const result = sl.shippingSum(logs[0].item, new Date(2020, 1, 1), new Date(2020, 1, 31))
    expect(result).toBe(2);
});

function createStockUnits() {
    return [{
        id: createUUID(),
        name: "test_name_1",
        conversionFactor: 1
    }, {
        id: createUUID(),
        name: "test_name_2",
        conversionFactor: 10
    }];
}

function createStockItems() {

    const suArray = createStockUnits();
    return [{
        id: createUUID(),
        name: "test_name_1",
        receivingUnit: suArray[0],
        brewingUnit: suArray[1],
        stockUnit: suArray[0],
        baseUnit: suArray[0]
    }, {
        id: createUUID(),
        name: "test_name_2",
        receivingUnit: suArray[0],
        brewingUnit: suArray[1],
        stockUnit: suArray[0],
        baseUnit: suArray[0]
    }, {
        id: createUUID(),
        name: "test_name_3",
        receivingUnit: suArray[0],
        brewingUnit: suArray[1],
        stockUnit: suArray[1],
        baseUnit: suArray[0]
    }];
}

function createStockLogs() {

    const siArray = createStockItems();
    const sArray = [{
        id: createUUID(),
        actDate: new Date(2020, 1, 1),
        item: siArray[0],
        receivingQuantity: 10,
        shippingQuantity: 0,
        description: 'sample_comment_1',
        type: 0
    }, {
        id: createUUID(),
        actDate: new Date(2020, 1, 3),
        item: siArray[0],
        receivingQuantity: 10,
        shippingQuantity: 0,
        description: 'sample_comment_2',
        type: 0
    }, {
        id: createUUID(),
        actDate: new Date(2020, 1, 1),
        item: siArray[0],
        receivingQuantity: 0,
        shippingQuantity: 1,
        description: 'sample_comment_2',
        type: 1
    }, {
        id: createUUID(),
        actDate: new Date(2020, 1, 2),
        item: siArray[0],
        receivingQuantity: 10,
        shippingQuantity: 0,
        description: 'sample_comment_2',
        type: 0
    }, {
        id: createUUID(),
        actDate: new Date(2020, 1, 2),
        item: siArray[0],
        receivingQuantity: 0,
        shippingQuantity: 1,
        description: 'sample_comment_2',
        type: 1
    }, {
        id: createUUID(),
        actDate: new Date(2020, 1, 2),
        item: siArray[0],
        receivingQuantity: 10,
        shippingQuantity: 0,
        description: 'sample_comment_2',
        type: 0
    }, {
        id: createUUID(),
        actDate: new Date(2020, 1, 3),
        item: siArray[1],
        receivingQuantity: 10,
        shippingQuantity: 0,
        description: 'sample_comment_3',
        type: 0
    }, {
        id: createUUID(),
        actDate: new Date(2020, 1, 4),
        item: siArray[2],
        receivingQuantity: 10,
        shippingQuantity: 0,
        description: 'sample_comment_3',
        type: 0
    }];

    return sArray;
}