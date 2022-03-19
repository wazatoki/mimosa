import { StockUnitRepo } from "./stockUnit";
import { StockUnit } from "../domains/master";
import * as db from "./db";
import { createUUID } from '../utils/string';

const d = new db.DBbase(db.createConnection());

beforeEach( async () => {
    await d.none('delete from stock_units');
});

afterAll(() => {
    d.con.$pool.end();
});

test("stockUnit insert", async () => {
    
    const stockUnitRepo = new StockUnitRepo(d);
    const stockUnit = new StockUnit()

    stockUnit.name = "test_name"
    stockUnit.conversionFactor = 1.5

    const id = await stockUnitRepo.insert(stockUnit, "test_staff_id_1");
    const result = await d.one('select name, conversion_factor from stock_units where id=$1', id);

    expect(stockUnit.name).toBe(result.name);
    expect(stockUnit.conversionFactor).toBe(result.conversion_factor);

});

test("stockUnit update", async () => {

    const stockUnitRepo = new StockUnitRepo(d);
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

    await d.none('insert into stock_units(${this:name}) values(${this:csv})', params);

    stockUnit.id = id
    stockUnit.name = "test_name_2"
    stockUnit.conversionFactor = 2

    await stockUnitRepo.update(stockUnit, "test_staff_id_2");
    const result = await d.one('select name, conversion_factor from stock_units where id=$1', id);

    expect(stockUnit.name).toBe(result.name);
    expect(stockUnit.conversionFactor).toBe(result.conversion_factor);

});

test("stockUnit remove", async () => {

    const stockUnitRepo = new StockUnitRepo(d);
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

    await d.none('insert into stock_units(${this:name}) values(${this:csv})', params);

    await stockUnitRepo.remove(id, "test_staff_id_2");
    const result = await d.one('select count(*) from stock_units where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("stockUnit selectAll", async () => {

    const stockUnitRepo = new StockUnitRepo(d);
    const suArray = [];
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
        suArray.push(su);

        await d.none('insert into stock_units(${this:name}) values(${this:csv})', params);
    }

    const result = await stockUnitRepo.selectAll()

    expect(suArray).toEqual(result);
});