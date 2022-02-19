import { insert, update } from "./stockUnit";
import { StockUnit } from "../domains/master";
import { connect } from "./db";
import  'date-utils';
import { createUUID } from '../utils/string';

test("stockUnit insert", async () => {
    const con = connect()
    const socketUnit = new StockUnit()

    await con.none('delete from stock_units')
    socketUnit.name = "test_name"
    socketUnit.conversionFactor = 1.5

    const id = await insert(socketUnit, "test_staff_id_1");
    const result = await con.one('select name, conversion_factor from stock_units where id=$1', id);
    con.$pool.end()

    expect(result.name).toBe(socketUnit.name);
    expect(result.conversion_factor).toBe(socketUnit.conversionFactor);

});

test("stockUnit update", async () => {
    const con = connect()
    const socketUnit = new StockUnit()

    await con.none('delete from stock_units')

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

    await con.none('insert into stock_units(${this:name}) values(${this:csv})', params);

    socketUnit.id = id
    socketUnit.name = "test_name_2"
    socketUnit.conversionFactor = 2

    await update(socketUnit, "test_staff_id_2");
    const result = await con.one('select name, conversion_factor from stock_units where id=$1', id);

    con.$pool.end();

    expect(result.name).toBe(socketUnit.name);
    expect(result.conversion_factor).toBe(socketUnit.conversionFactor);

});