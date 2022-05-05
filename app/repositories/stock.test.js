import { StockItem, StockUnit } from "../domains/master";
import { StockLogEntity } from "../domains/stock";
import { Recipe } from "../domains/recipe";
import { StockRecieve } from "../domains/stockReceive"
import { createUUID } from "../utils/string";
import * as db from "./db";
import { StockRepo } from "./stock"

const d = new db.DBbase(db.createConnection());

beforeEach(async () => {
    await d.none('delete from stock_logs');
    await d.none('delete from stock_items');
    await d.none('delete from stock_receive');
    await d.none('delete from stock_units');
    await d.none('delete from recipe');
});

afterAll(() => {
    d.con.$pool.end();
});

test("stockLogs insert", async () => {

    const stockRepo = new StockRepo(d);
    const reArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            act_date: new Date(2020, 1, i),
        };

        let re = new Recipe(params.name, params.act_date);
        re.id = params.id;
        reArray.push(re);

        await d.none('insert into recipe(${this:name}) values(${this:csv})', params);
    }

    const srArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            slip_id: 'test000' + i,
            slip_date: new Date(2020, 1, i),
            picture_path: 'test_path_' + i
        };

        let sr = new StockRecieve(params.name, params.slip_id, params.slip_date, params.picture_path);
        sr.id = params.id;
        srArray.push(sr);

        await d.none('insert into stock_receive(${this:name}) values(${this:csv})', params);
    }

    const suArray = [];
    for (let i = 0; i < 5; i++) {

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

    const siArray = [];
    for (let i = 0; i < 10; i++) {

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
        si.brewingUnit = suArray[(i + 2) % 5]
        si.stockUnit = suArray[(i + 7) % 5]
        si.baseUnit = suArray[(i + 5) % 5]
        siArray.push(si);

        await d.none('insert into stock_items(${this:name}) values(${this:csv})', params);
    }

    const stockLogEntity = new StockLogEntity()

    stockLogEntity.actDate = new Date(2020, 1, 1);
    stockLogEntity.item = siArray[1];
    stockLogEntity.receivingQuantity = 10.45;
    stockLogEntity.shippingQuantity = 0;
    stockLogEntity.description = 'sample_comment_1';
    stockLogEntity.recipe = reArray[1];
    stockLogEntity.stockReceive = srArray[1];

    const id = await stockRepo.insert(stockLogEntity, "test_staff_id_1");
    const result = await d.one('select act_date, item_id, receiving_quantity, shipping_quantity, description from stock_logs where id=$1', id);

    expect(stockLogEntity.actDate).toEqual(result.act_date);
    expect(stockLogEntity.item.id).toBe(result.item_id);
    expect(stockLogEntity.receivingQuantity).toBe(Number(result.receiving_quantity));
    expect(stockLogEntity.shippingQuantity).toBe(Number(result.shipping_quantity));
    expect(stockLogEntity.description).toBe(result.description);

});

test("stockLogs update", async () => {

    const stockRepo = new StockRepo(d);
    const reArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            act_date: new Date(2020, 1, i),
        };

        let re = new Recipe(params.name, params.act_date);
        re.id = params.id;
        reArray.push(re);

        await d.none('insert into recipe(${this:name}) values(${this:csv})', params);
    }

    const srArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            slip_id: 'test000' + i,
            slip_date: new Date(2020, 1, i),
            picture_path: 'test_path_' + i
        };

        let sr = new StockRecieve(params.name, params.slip_id, params.slip_date, params.picture_path);
        sr.id = params.id;
        srArray.push(sr);

        await d.none('insert into stock_receive(${this:name}) values(${this:csv})', params);
    }

    const suArray = [];
    for (let i = 0; i < 5; i++) {

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

    const siArray = [];
    for (let i = 0; i < 10; i++) {

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
        si.brewingUnit = suArray[(i + 2) % 5]
        si.stockUnit = suArray[(i + 7) % 5]
        si.baseUnit = suArray[(i + 5) % 5]
        siArray.push(si);

        await d.none('insert into stock_items(${this:name}) values(${this:csv})', params);
    }

    const stockLogEntity = new StockLogEntity()

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        act_date: new Date(2020, 1, 1),
        item_id: siArray[1].id,
        receiving_quantity: 10.45,
        shipping_quantity: 50.5,
        description: 'sample_comment_1',
        recipe_id: reArray[1].id,
        stock_receive_id: srArray[1].id
    };

    await d.none('insert into stock_logs(${this:name}) values(${this:csv})', params);

    stockLogEntity.id = id;
    stockLogEntity.actDate = new Date(2020, 4, 10);
    stockLogEntity.item = suArray[1];
    stockLogEntity.receivingQuantity = 20.15;
    stockLogEntity.shippingQuantity = 30.35;
    stockLogEntity.description = 'sample_comment_1_1';
    stockLogEntity.recipe = reArray[1];
    stockLogEntity.stockReceive = srArray[1];

    await stockRepo.update(stockLogEntity, "test_staff_id_2");
    const result = await d.one('select act_date, item_id, receiving_quantity, shipping_quantity, description from stock_logs where id=$1', id);

    expect(stockLogEntity.actDate).toEqual(result.act_date);
    expect(stockLogEntity.item.id).toBe(result.item_id);
    expect(stockLogEntity.receivingQuantity).toBe(Number(result.receiving_quantity));
    expect(stockLogEntity.shippingQuantity).toBe(Number(result.shipping_quantity));
    expect(stockLogEntity.description).toBe(result.description);
});

test("stockLogs remove", async () => {

    const stockRepo = new StockRepo(d);
    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        act_date: new Date(2020, 1, 1),
        item_id: createUUID(),
        receiving_quantity: 10.45,
        shipping_quantity: 50.5,
        description: 'sample_comment_1'
    };

    await d.none('insert into stock_logs(${this:name}) values(${this:csv})', params);

    await stockRepo.remove(id, "test_staff_id_2");
    const result = await d.one('select count(*) from stock_logs where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("stock selectAll", async () => {

    const stockRepo = new StockRepo(d);
    const reArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            act_date: new Date(2020, 1, i),
        };

        let re = new Recipe(params.name, params.act_date);
        re.id = params.id;
        reArray.push(re);

        await d.none('insert into recipe(${this:name}) values(${this:csv})', params);
    }

    const suArray = [];
    for (let i = 0; i < 5; i++) {

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

    const srArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            slip_id: 'test000' + i,
            slip_date: new Date(2020, 1, i),
            picture_path: 'test_path_' + i
        };

        let sr = new StockRecieve(params.name, params.slip_id, params.slip_date, params.picture_path);
        sr.id = params.id;
        srArray.push(sr);

        await d.none('insert into stock_receive(${this:name}) values(${this:csv})', params);
    }

    const siArray = [];
    for (let i = 0; i < 10; i++) {

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
        si.brewingUnit = suArray[(i + 2) % 5]
        si.stockUnit = suArray[(i + 7) % 5]
        si.baseUnit = suArray[(i + 5) % 5]
        siArray.push(si);

        await d.none('insert into stock_items(${this:name}) values(${this:csv})', params);
    }

    const sArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            act_date: new Date(2020, 1, 1),
            item_id: siArray[(i + 7) % 8].id,
            receiving_quantity: (i + 1) * 1.45,
            shipping_quantity: (i + 1) * 2.75,
            description: 'sample_comment_' + i,
            type: 0,
            recipe_id: reArray[1].id,
            stock_receive_id: srArray[1].id
        };

        let s = new StockLogEntity()
        s.id = params.id;
        s.actDate = params.act_date;
        s.item = siArray[(i + 7) % 8];
        s.receivingQuantity = params.receiving_quantity;
        s.shippingQuantity = params.shipping_quantity;
        s.description = params.description;
        s.recipe = reArray[1];
        s.stockReceive = srArray[1];
        sArray.push(s);

        await d.none('insert into stock_logs(${this:name}) values(${this:csv})', params);
    }

    const result = await stockRepo.selectAll();
    expect(sArray).toEqual(result);
});