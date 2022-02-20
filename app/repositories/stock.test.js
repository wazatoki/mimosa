import { StockItem } from "../domains/master";
import { StockLogEntity } from "../domains/stock";
import { createUUID } from "../utils/string";
import { con, none, one } from "./db";
import { insert, update, remove } from "./stock"

beforeEach( async () => {
    await none('delete from stock_logs');
});

afterAll(() => {
    con.$pool.end();
});

test("stockLogs insert", async () => {
    
    const stockLogEntity = new StockLogEntity()

    stockLogEntity.actDate = new Date(2020,1,1);
    stockLogEntity.item = new StockItem();
    stockLogEntity.item.id = createUUID();
    stockLogEntity.receivingQuantity = 10.45;
    stockLogEntity.shippingQuantity = 0;
    stockLogEntity.description = 'sample_comment_1';

    const id = await insert(stockLogEntity, "test_staff_id_1");
    const result = await one('select act_date, item_id, receiving_quantity, shipping_quantity, description from stock_logs where id=$1', id);
    
    expect(stockLogEntity.actDate).toEqual(result.act_date);
    expect(stockLogEntity.item.id).toBe(result.item_id);
    expect(stockLogEntity.receivingQuantity).toBe(Number(result.receiving_quantity));
    expect(stockLogEntity.shippingQuantity).toBe(Number(result.shipping_quantity));
    expect(stockLogEntity.description).toBe(result.description);

});

test("stockLogs update", async () => {

    const stockLogEntity = new StockLogEntity()

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        act_date: new Date(2020,1,1),
        item_id: createUUID(),
        receiving_quantity: 10.45,
        shipping_quantity: 50.5,
        description: 'sample_comment_1'
    };

    await none('insert into stock_logs(${this:name}) values(${this:csv})', params);

    stockLogEntity.id = id;
    stockLogEntity.actDate = new Date(2020,4,10),
    stockLogEntity.item = new StockItem();
    stockLogEntity.item.id = params.item_id,
    stockLogEntity.receivingQuantity = 20.15,
    stockLogEntity.shippingQuantity = 30.35,
    stockLogEntity.description = 'sample_comment_1_1'

    await update(stockLogEntity, "test_staff_id_2");
    const result = await one('select act_date, item_id, receiving_quantity, shipping_quantity, description from stock_logs where id=$1', id);

    expect(stockLogEntity.actDate).toEqual(result.act_date);
    expect(stockLogEntity.item.id).toBe(result.item_id);
    expect(stockLogEntity.receivingQuantity).toBe(Number(result.receiving_quantity));
    expect(stockLogEntity.shippingQuantity).toBe(Number(result.shipping_quantity));
    expect(stockLogEntity.description).toBe(result.description);
});

test("stockLogs remove", async () => {

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        act_date: new Date(2020,1,1),
        item_id: createUUID(),
        receiving_quantity: 10.45,
        shipping_quantity: 50.5,
        description: 'sample_comment_1'
    };

    await none('insert into stock_logs(${this:name}) values(${this:csv})', params);

    await remove(id, "test_staff_id_2");
    const result = await one('select count(*) from stock_logs where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});