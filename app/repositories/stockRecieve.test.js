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

test("stockReceive update", async () => {

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name_1",
        slip_id: 'test0001',
        slip_date: new Date(2020,1,1),
        picture_path: 'test_path'
    };

    await none('insert into stock_receive(${this:name}) values(${this:csv})', params);

    const stockReceive = new StockRecieve("test_name_2", "test0002", new Date(2020,1,2), "test_path_2")
    stockReceive.id = id


    await update(stockReceive, "test_staff_id_2");
    const result = await one('select name, slip_id, slip_date, picture_path from stock_receive where id=$1', id);

    expect(stockReceive.name).toBe(result.name);
    expect(stockReceive.slipID).toEqual(result.slip_id);
    expect(stockReceive.slipDate).toEqual(result.slip_date);
    expect(stockReceive.picturePath).toEqual(result.picture_path);
});

test("stockReceive remove", async () => {

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name_1",
        slip_id: 'test0001',
        slip_date: new Date(2020,1,1),
        picture_path: 'test_path'
    };

    await none('insert into stock_receive(${this:name}) values(${this:csv})', params);

    await remove(id, "test_staff_id_2");
    const result = await one('select count(*) from stock_receive where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("stockReceive selectAll", async () => {

    const srArray = [];
    for(let i = 0; i < 10; i++){

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            slip_id: 'test000' + i,
            slip_date: new Date(2020,1,i),
            picture_path: 'test_path_' + i
        };

        let sr = new StockRecieve(params.name, params.slip_id, params.slip_date, params.picture_path);
        sr.id = params.id;
        srArray.push(sr);

        await none('insert into stock_receive(${this:name}) values(${this:csv})', params);
    }

    const result = await selectAll()

    const sortedArray = srArray.sort( (a, b) => {
        if (a.slipDate > b.slipDate){
            return 1
        }
        if (a.slipDate < b.slipDate){
            return -1
        }
        return 0
    });
    expect(result).toEqual(sortedArray);
});