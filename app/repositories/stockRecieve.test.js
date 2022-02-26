import { insert, remove, selectAll, update } from "./stockReceive";
import { StockRecieve } from "../domains/stockReceive";
import { con, none, one } from "./db";
import { createUUID } from '../utils/string';

beforeEach( async () => {
    await none('delete from stock_receive');
});

afterAll(() => {
    con.$pool.end();
});

test("stockReceive insert", async () => {
    
    const stockReceive = new StockRecieve("test_name", "test00001", new Date(2020,1,1), "test_path")

    const id = await insert(stockReceive, "test_staff_id_1");
    const result = await one('select name, slip_id, slip_date, picture_path from stock_receive where id=$1', id);

    expect(stockReceive.name).toBe(result.name);
    expect(stockReceive.slipID).toEqual(result.slip_id);
    expect(stockReceive.slipDate).toEqual(result.slip_date);
    expect(stockReceive.picturePath).toEqual(result.picture_path);

});