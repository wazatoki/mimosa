import { StockItem, StockUnit } from "../domains/master";
import { compare } from "../testUtils/testUtil";
import { createUUID } from "../utils/string";
import { con, none, one } from "./db";
import { insert, update, remove, selectAll } from "./stockItem";

beforeEach( async () => {
    await none('delete from stock_items');
    await none('delete from stock_units');
});

afterAll(() => {
    con.$pool.end();
});

test("stockItem insert", async () => {
    
    const stockItem = new StockItem();
    stockItem.name = "test_name";
    stockItem.receivingUnit.id= createUUID();
    stockItem.shippigUnit.id= createUUID();
    stockItem.stockUnit.id= createUUID();
    stockItem.baseUnit.id= createUUID();

    const id = await insert(stockItem, "test_staff_id_1");
    const result = await one('select name, receiving_unit_id, shipping_unit_id, stock_unit_id, base_unit_id from stock_items where id=$1', id);

    expect(stockItem.name).toBe(result.name);
    expect(stockItem.receivingUnit.id).toBe(result.receiving_unit_id);
    expect(stockItem.shippigUnit.id).toBe(result.shipping_unit_id);
    expect(stockItem.stockUnit.id).toBe(result.stock_unit_id);
    expect(stockItem.baseUnit.id).toBe(result.base_unit_id);

});

test("stockItem update", async () => {

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
        shipping_unit_id: createUUID(),
        stock_unit_id: createUUID(),
        base_unit_id: createUUID()
    };

    await none('insert into stock_items(${this:name}) values(${this:csv})', params);

    stockItem.id = id;
    stockItem.name = "updated_test_name"
    stockItem.receivingUnit.id= createUUID();
    stockItem.shippigUnit.id= createUUID();
    stockItem.stockUnit.id= createUUID();
    stockItem.baseUnit.id= createUUID();
    
    await update(stockItem, "test_staff_id_2");
    const result = await one('select name, receiving_unit_id, shipping_unit_id, stock_unit_id, base_unit_id from stock_items where id=$1', id);

    expect(stockItem.name).toEqual(result.name);
    expect(stockItem.receivingUnit.id).toBe(result.receiving_unit_id);
    expect(stockItem.shippigUnit.id).toBe(result.shipping_unit_id);
    expect(stockItem.stockUnit.id).toBe(result.stock_unit_id);
    expect(stockItem.baseUnit.id).toBe(result.base_unit_id);
});

test("stockItem remove", async () => {

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name",
        receiving_unit_id: createUUID(),
        shipping_unit_id: createUUID(),
        stock_unit_id: createUUID(),
        base_unit_id: createUUID()
    };

    await none('insert into stock_items(${this:name}) values(${this:csv})', params);

    await remove(id, "test_staff_id_2");
    const result = await one('select count(*) from stock_items where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("stockItem selectAll", async () => {

    const suArray = [];
    for(let i = 0; i < 5; i++){

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            conversion_factor: i
        };

        let su = new StockUnit();
        su.id = params.id;
        su.name = params.name;
        su.conversionFactor = params.conversion_factor;
        suArray.push(su);

        await none('insert into stock_units(${this:name}) values(${this:csv})', params);
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
            shipping_unit_id: suArray[(i + 2) % 5].id,
            stock_unit_id: suArray[(i + 7) % 5].id,
            base_unit_id: suArray[(i + 5) % 5].id
        };

        let si = new StockItem()
        si.id = params.id;
        si.name = params.name;
        si.receivingUnit = suArray[(i + 3) % 5]
        si.shippigUnit = suArray[(i + 2) % 5]
        si.stockUnit = suArray[(i + 7) % 5]
        si.baseUnit = suArray[(i + 5) % 5]
        siArray.push(si);

        await none('insert into stock_items(${this:name}) values(${this:csv})', params);
    }

    const result = await selectAll()

    expect(siArray).toEqual(result);
});