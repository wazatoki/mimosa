import { StockItem } from "../domains/master";
import { StockLogEntity } from "../domains/stock";
import { createUUID } from "../utils/string";
import { con, none, one } from "./db";
import { insert } from "./stock"

beforeEach( async () => {
    await none('delete from stock_logs');
});

afterAll(() => {
    con.$pool.end();
});

test("stock insert", async () => {
    
    const stockLogEntity = new StockLogEntity

    stockLogEntity.actDate = new Date(2020,1,1);
    stockLogEntity.item = new StockItem();
    stockLogEntity.item.id = createUUID();
    stockLogEntity.receivingQuantity = 10.45;
    stockLogEntity.shippingQuantity = 0;
    stockLogEntity.description = 'sample_comment_1';

    const id = await insert(stockLogEntity, "test_staff_id_1");
    const result = await one('select act_date, item_id, receiving_quantity, shipping_quantity, description from stock_logs where id=$1', id);
    
    expect(result.act_date).toEqual(stockLogEntity.actDate);
    expect(result.item_id).toBe(stockLogEntity.item.id);
    expect(Number(result.receiving_quantity)).toBe(stockLogEntity.receivingQuantity);
    expect(Number(result.shipping_quantity)).toBe(stockLogEntity.shippingQuantity);
    expect(result.description).toBe(stockLogEntity.description);

});
