import { StockRecieveRepo } from "./stockRecieve";
import { StockRecieve } from "../domains/stockReceive";
import { StockLogEntity } from '../domains/stock'
import { StockItem, StockUnit} from '../domains/master'
import * as db from "./db";
import { createUUID } from '../utils/string';

const d = new db.DBbase(db.createConnection());

beforeEach( async () => {
    await d.none('delete from stock_receive');
});

afterAll(() => {
    d.con.$pool.end();
});

test("stockReceive insert", async () => {

    const stockReceiveRepo = new StockRecieveRepo(d);
    const su = new StockUnit();
        su.id = 'test_unit_id';
        su.name = 'test_unit_name_id';
        su.conversionFactor = 1;

    const si = new StockItem()
        si.id = 'test_item_id_1';
        si.name = 'test_item_name_1';
        si.receivingUnit = su
        si.brewingUnit = su
        si.stockUnit = su
        si.baseUnit = su

    const stockLogEntity = new StockLogEntity()

    stockLogEntity.actDate = new Date(2020, 1, 1);
    stockLogEntity.item = si;
    stockLogEntity.receivingQuantity = 10.45;
    stockLogEntity.shippingQuantity = 0;
    stockLogEntity.description = 'sample_comment_1';
    stockLogEntity.type = 0;
    
    const stockReceive = new StockRecieve("test_name", "test00001", new Date(2020,1,1), "test_path")
    stockReceive.stockLogs.push(stockLogEntity);
    const id = await stockReceiveRepo.insert(stockReceive, "test_staff_id_1");
    const result = await d.one('select name, slip_id, slip_date, picture_path from stock_receive where id=$1', id);
    const result1 = await d.one('select act_date, item_id, receiving_quantity, description, type from stock_logs where stock_receive_id=$1', id);

    expect(stockReceive.name).toBe(result.name);
    expect(stockReceive.slipID).toEqual(result.slip_id);
    expect(stockReceive.slipDate).toEqual(result.slip_date);
    expect(stockReceive.picturePath).toEqual(result.picture_path);

    expect(stockLogEntity.actDate).toEqual(result1.act_date);
    expect(stockLogEntity.item.id).toBe(result1.item_id);
    expect(stockLogEntity.receivingQuantity).toBe(Number(result1.receiving_quantity));
    expect(stockLogEntity.description).toBe(result1.description);
    expect(stockLogEntity.type).toBe(Number(result1.type));
});

test("stockReceive update", async () => {

    const stockReceiveRepo = new StockRecieveRepo(d);
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
    await d.none('insert into stock_receive(${this:name}) values(${this:csv})', params);

    for (let i = 0; i < 5; i++) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_1",
            operated_at: new Date(),
            operated_by: "test_staff_id_1",
            act_date: new Date(2020, 1, i),
            item_id: createUUID(),
            receiving_quantity: 10.45,
            shipping_quantity: 50.5,
            description: 'sample_comment_'+i,
            stock_receive_id: id
        };
        await d.none('insert into stock_logs(${this:name}) values(${this:csv})', params);
    }

    const su = new StockUnit();
        su.id = 'test_unit_id';
        su.name = 'test_unit_name_id';
        su.conversionFactor = 1;

    const si = new StockItem()
        si.id = 'test_item_id_1';
        si.name = 'test_item_name_1';
        si.receivingUnit = su
        si.brewingUnit = su
        si.stockUnit = su
        si.baseUnit = su

    const stockLogEntity = new StockLogEntity();

    stockLogEntity.actDate = new Date(2020, 1, 20);
    stockLogEntity.item = si;
    stockLogEntity.receivingQuantity = 10.45;
    stockLogEntity.shippingQuantity = 0;
    stockLogEntity.description = 'sample_comment_1';
    stockLogEntity.type = 0;
    
    const stockReceive = new StockRecieve("test_name_2", "test0002", new Date(2020,1,2), "test_path_2")
    stockReceive.id = id
    stockReceive.stockLogs.push(stockLogEntity);

    await stockReceiveRepo.update(stockReceive, "test_staff_id_2");
    const result = await d.one('select name, slip_id, slip_date, picture_path from stock_receive where id=$1', id);
    const result1 = await d.one('select act_date, item_id, receiving_quantity, description, type from stock_logs where del = false and stock_receive_id=$1', id);
    const result2 = await d.one('select count(*) as count from stock_logs where del = false and stock_receive_id=$1', id);

    expect(stockReceive.name).toBe(result.name);
    expect(stockReceive.slipID).toEqual(result.slip_id);
    expect(stockReceive.slipDate).toEqual(result.slip_date);
    expect(stockReceive.picturePath).toEqual(result.picture_path);

    expect(stockLogEntity.actDate).toEqual(result1.act_date);
    expect(stockLogEntity.item.id).toBe(result1.item_id);
    expect(stockLogEntity.receivingQuantity).toBe(Number(result1.receiving_quantity));
    expect(stockLogEntity.description).toBe(result1.description);
    expect(stockLogEntity.type).toBe(Number(result1.type));
    expect(1).toBe(Number(result2.count));
});

test("stockReceive remove", async () => {

    const stockReceiveRepo = new StockRecieveRepo(d);
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
    await d.none('insert into stock_receive(${this:name}) values(${this:csv})', params);

    for (let i = 0; i < 5; i++) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_1",
            operated_at: new Date(),
            operated_by: "test_staff_id_1",
            act_date: new Date(2020, 1, i),
            item_id: createUUID(),
            receiving_quantity: 10.45,
            shipping_quantity: 50.5,
            description: 'sample_comment_'+i,
            stock_receive_id: id
        };
        await d.none('insert into stock_logs(${this:name}) values(${this:csv})', params);
    }

    await stockReceiveRepo.remove(id, "test_staff_id_2");
    const result = await d.one('select count(*) from stock_receive where del=false and id=$1', id);
    const result1 = await d.one('select count(*) as count from stock_logs where del = false and stock_receive_id=$1', id);

    expect(0).toBe(Number(result.count));
    expect(0).toBe(Number(result1.count));
});

test("stockReceive selectAll", async () => {

    const stockReceiveRepo = new StockRecieveRepo(d);
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

        await d.none('insert into stock_receive(${this:name}) values(${this:csv})', params);
    }

    const result = await stockReceiveRepo.selectAll();

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