import { insert, remove, selectAll, update } from "./inventory";
import { Inventory } from "../domains/stock";
import { StockUnit } from '../domains/master'
import { con, none, one } from "./db";
import { createUUID } from '../utils/string';
import { StockItem } from "../domains/master";

beforeEach( async () => {
    await none('delete from inventories');
    await none('delete from stock_units');
    await none('delete from stock_items');
});

afterAll(() => {
    con.$pool.end();
});

test("inventories insert", async () => {
    
    const siArray = await createTestData();
    const inventory = new Inventory(siArray[1], new Date(2020,1,1));
    inventory.id = createUUID();

    const id = await insert(inventory, "test_staff_id_1");
    const result = await one('select act_date, item_id, quantity from inventories where id=$1', id);

    expect(inventory.actDate).toEqual(result.act_date);
    expect(inventory.item.id).toBe(result.item_id);
    expect(inventory.quantity).toBe(Number(result.quantity));

});

test("inventories update", async () => {

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        act_date: new Date(2020,1,1),
        item_id: createUUID(),
        quantity: 10
    };

    await none('insert into inventories(${this:name}) values(${this:csv})', params);

    const siArray = await createTestData();
    const inventory = new Inventory(siArray[1], new Date(2020,1,2))
    inventory.id = id

    await update(inventory, "test_staff_id_2");
    const result = await one('select act_date, item_id, quantity from inventories where id=$1', id);

    expect(inventory.actDate).toEqual(result.act_date);
    expect(inventory.item.id).toBe(result.item_id);
    expect(inventory.quantity).toBe(Number(result.quantity));

});

test("inventories remove", async () => {

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        act_date: new Date(2020,1,1),
        item_id: createUUID(),
        quantity: 10
    };

    await none('insert into inventories(${this:name}) values(${this:csv})', params);

    await remove(id, "test_staff_id_2");
    const result = await one('select count(*) from inventories where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("inventories selectAll", async () => {

    const siArray = await createTestData();
    const invArray = [];
    for(let i = 0; i < 10; i++){

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            act_date: new Date(2020,1,i),
            item_id: siArray[i % 3].id,
            quantity: i
        };

        let inv = new Inventory(siArray[i % 3], params.act_date);
        inv.id = params.id;
        inv.quantity = params.quantity;
        invArray.push(inv);

        await none('insert into inventories(${this:name}) values(${this:csv})', params);
    }

    const result = await selectAll()

    const sortedArray = invArray.sort( (a, b) => {
        if (a.actDate > b.actDate){
            return 1
        }
        if (a.actDate < b.actDate){
            return -1
        }
        return 0
    });
    expect(result).toEqual(sortedArray);
});

async function createTestData () {
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
        si.shippingUnit = suArray[(i + 2) % 5]
        si.stockUnit = suArray[(i + 7) % 5]
        si.baseUnit = suArray[(i + 5) % 5]
        siArray.push(si);

        await none('insert into stock_items(${this:name}) values(${this:csv})', params);
    }
    return siArray;
}