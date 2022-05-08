import { StockItem, StockUnit } from "../domains/master";
import { createUUID } from "../utils/string";
import * as db from "./db";
import { StockItemRepo } from "./stockItem";

const d = new db.DBbase(db.createConnection())

beforeEach( async () => {
    await d.none('delete from stock_items');
    await d.none('delete from stock_units');
});

afterAll(() => {
    d.con.$pool.end();
});

test("stockItem insert", async () => {
    
    const stockItemRepo = new StockItemRepo(d);
    const stockItem = new StockItem();
    stockItem.name = "test_name";
    stockItem.receivingUnit.id= createUUID();
    stockItem.receivingUnitConversionFactor = 10;
    stockItem.brewingUnit.id= createUUID();
    stockItem.brewingUnitConversionFactor = 100;
    stockItem.stockUnit.id= createUUID();
    stockItem.stockUnitConversionFactor = 1000;
    stockItem.baseUnit.id= createUUID();

    const id = await stockItemRepo.insert(stockItem, "test_staff_id_1");
    const result = await d.one('select name,'
        + 'receiving_unit_id, receiving_conversion_factor,'
        + 'brewing_unit_id, brewing_conversion_factor,'
        + 'stock_unit_id, stock_conversion_factor, base_unit_id from stock_items where id=$1', id);

    expect(stockItem.name).toBe(result.name);
    expect(stockItem.receivingUnit.id).toBe(result.receiving_unit_id);
    expect(stockItem.brewingUnit.id).toBe(result.brewing_unit_id);
    expect(stockItem.stockUnit.id).toBe(result.stock_unit_id);
    expect(stockItem.baseUnit.id).toBe(result.base_unit_id);

});

test("stockItem update", async () => {

    const stockItemRepo = new StockItemRepo(d);
    const stockItem = new StockItem();
    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name",
        receiving_unit_id: createUUID(),
        receiving_conversion_factor: 10,
        brewing_unit_id: createUUID(),
        brewing_conversion_factor: 100,
        stock_unit_id: createUUID(),
        stock_conversion_factor: 1000,
        base_unit_id: createUUID()
    };

    await d.none('insert into stock_items(${this:name}) values(${this:csv})', params);

    stockItem.id = id;
    stockItem.name = "updated_test_name"
    stockItem.receivingUnit.id= createUUID();
    stockItem.receivingUnitConversionFactor = 10;
    stockItem.brewingUnit.id= createUUID();
    stockItem.brewingUnitConversionFactor = 100;
    stockItem.stockUnit.id= createUUID();
    stockItem.stockUnitConversionFactor = 1000;
    stockItem.baseUnit.id= createUUID();
    
    await stockItemRepo.update(stockItem, "test_staff_id_2");
    const result = await d.one('select name,'
        + 'receiving_unit_id, receiving_conversion_factor,'
        + 'brewing_unit_id, brewing_conversion_factor,'
        + 'stock_unit_id, stock_conversion_factor, base_unit_id from stock_items where id=$1', id);

    expect(stockItem.name).toEqual(result.name);
    expect(stockItem.receivingUnit.id).toBe(result.receiving_unit_id);
    expect(stockItem.brewingUnit.id).toBe(result.brewing_unit_id);
    expect(stockItem.stockUnit.id).toBe(result.stock_unit_id);
    expect(stockItem.baseUnit.id).toBe(result.base_unit_id);
});

test("stockItem remove", async () => {

    const stockItemRepo = new StockItemRepo(d);
    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name",
        receiving_unit_id: createUUID(),
        receiving_conversion_factor: 10,
        brewing_unit_id: createUUID(),
        brewing_conversion_factor: 100,
        stock_unit_id: createUUID(),
        stock_conversion_factor: 1000,
        base_unit_id: createUUID()
    };

    await d.none('insert into stock_items(${this:name}) values(${this:csv})', params);

    await stockItemRepo.remove(id, "test_staff_id_2");
    const result = await d.one('select count(*) from stock_items where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("stockItem selectAll", async () => {

    const stockItemRepo = new StockItemRepo(d);
    const suArray = [];
    for(let i = 0; i < 5; i++){

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i
        };

        let su = new StockUnit();
        su.id = params.id;
        su.name = params.name;
        suArray.push(su);

        await d.none('insert into stock_units(${this:name}) values(${this:csv})', params);
    }

    const siArray = [];
    for(let i = 0; i < 10; i++){

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            receiving_unit_id: suArray[(i + 3) % 5].id,
            receiving_conversion_factor: 10,
            brewing_unit_id: suArray[(i + 2) % 5].id,
            brewing_conversion_factor: 100,
            stock_unit_id: suArray[(i + 7) % 5].id,
            stock_conversion_factor: 1000,
            base_unit_id: suArray[(i + 5) % 5].id
        };

        let si = new StockItem()
        si.id = params.id;
        si.name = params.name;
        si.receivingUnit = suArray[(i + 3) % 5]
        si.receivingUnitConversionFactor = 10
        si.brewingUnit = suArray[(i + 2) % 5]
        si.brewingUnitConversionFactor = 100
        si.stockUnit = suArray[(i + 7) % 5]
        si.stockUnitConversionFactor =1000
        si.baseUnit = suArray[(i + 5) % 5]
        siArray.push(si);

        await d.none('insert into stock_items(${this:name}) values(${this:csv})', params);
    }

    const result = await stockItemRepo.selectAll()

    expect(siArray).toEqual(result);
});