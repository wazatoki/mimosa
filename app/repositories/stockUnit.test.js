import { insert, remove, selectAll, update } from "./stockUnit";
import { StockUnit } from "../domains/master";
import { con, none, one } from "./db";
import  'date-utils';
import { createUUID } from '../utils/string';

beforeEach( async () => {
    await none('delete from stock_units');
});

afterAll(() => {
    con.$pool.end();
});

test("stockUnit insert", async () => {
    
    const stockUnit = new StockUnit()

    stockUnit.name = "test_name"
    stockUnit.conversionFactor = 1.5

    const id = await insert(stockUnit, "test_staff_id_1");
    const result = await one('select name, conversion_factor from stock_units where id=$1', id);

    expect(stockUnit.name).toBe(result.name);
    expect(stockUnit.conversionFactor).toBe(result.conversion_factor);

});

test("stockUnit update", async () => {

    const stockUnit = new StockUnit()

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name_1",
        conversion_factor: 1.5
    };

    await none('insert into stock_units(${this:name}) values(${this:csv})', params);

    stockUnit.id = id
    stockUnit.name = "test_name_2"
    stockUnit.conversionFactor = 2

    await update(stockUnit, "test_staff_id_2");
    const result = await one('select name, conversion_factor from stock_units where id=$1', id);

    expect(stockUnit.name).toBe(result.name);
    expect(stockUnit.conversionFactor).toBe(result.conversion_factor);

});

test("stockUnit remove", async () => {

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name_1",
        conversion_factor: 1.5
    };

    await none('insert into stock_units(${this:name}) values(${this:csv})', params);

    await remove(id, "test_staff_id_2");
    const result = await one('select count(*) from stock_units where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("stockUnit selectAll", async () => {

    await none('delete from stock_units')

    const suarray = [];
    for(let i = 0; i < 10; i++){

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
        suarray.push(su);

        await none('insert into stock_units(${this:name}) values(${this:csv})', params);
    }

    const result = await selectAll()

    expect(suarray).toEqual(result);
});