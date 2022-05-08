import { InventoryRepo } from "./inventory";
import { Inventory } from "../domains/stock";
import { StockUnit } from '../domains/master'
import * as db from "./db";
import { createUUID } from '../utils/string';
import { StockItem } from "../domains/master";

const d = new db.DBbase(db.createConnection())

beforeEach( async () => {
    await d.none('delete from inventories');
    await d.none('delete from stock_units');
    await d.none('delete from stock_items');
});

afterAll(() => {
    d.con.$pool.end();
});


test("inventories insert", async () => {
    
    const inventoryRepo = new InventoryRepo(d);
    const siArray = await createTestData();
    const inventory = new Inventory(siArray[1], new Date(2020,1,1));
    inventory.id = createUUID();

    const id = await inventoryRepo.insert(inventory, "test_staff_id_1");
    const result = await d.one('select act_date, item_id, quantity from inventories where id=$1', id);

    expect(inventory.actDate).toEqual(result.act_date);
    expect(inventory.item.id).toBe(result.item_id);
    expect(inventory.quantity).toBe(Number(result.quantity));

});

test("inventories update", async () => {

    const inventoryRepo = new InventoryRepo(d);

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

    await d.none('insert into inventories(${this:name}) values(${this:csv})', params);

    const siArray = await createTestData();
    const inventory = new Inventory(siArray[1], new Date(2020,1,2))
    inventory.id = id

    await inventoryRepo.update(inventory, "test_staff_id_2");
    const result = await d.one('select act_date, item_id, quantity from inventories where id=$1', id);

    expect(inventory.actDate).toEqual(result.act_date);
    expect(inventory.item.id).toBe(result.item_id);
    expect(inventory.quantity).toBe(Number(result.quantity));

});

test("inventories remove", async () => {

    const inventoryRepo = new InventoryRepo(d);

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

    await d.none('insert into inventories(${this:name}) values(${this:csv})', params);

    await inventoryRepo.remove(id, "test_staff_id_2");
    const result = await d.one('select count(*) from inventories where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("inventories selectAll", async () => {

    const inventoryRepo = new InventoryRepo(d);

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

        await d.none('insert into inventories(${this:name}) values(${this:csv})', params);
    }

    const result = await inventoryRepo.selectAll()

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
        };

        let su = new StockUnit();
        su.id = params.id;
        su.name = params.name;
        suArray.push(su);

        await d.none('insert into stock_units(${this:name}) values(${this:csv})', params);
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
            receiving_conversion_factor: 10,
            brewing_unit_id: suArray[(i + 2) % 5].id,
            brewing_conversion_factor: 100,
            stock_unit_id: suArray[(i + 7) % 5].id,
            stock_conversion_factor: 1000,
            base_unit_id: suArray[(i + 5) % 5].id
        };

        let si = new StockItem()
        si.id = params.id;
        si.name = params.name;
        si.receivingUnit = suArray[(i + 3) % 5]
        si.receivingUnitConversionFactor = 10
        si.brewingUnit = suArray[(i + 2) % 5]
        si.brewingUnitConversionFactor = 100
        si.stockUnit = suArray[(i + 7) % 5]
        si.stockUnitConversionFactor = 1000
        si.baseUnit = suArray[(i + 5) % 5]
        siArray.push(si);

        await d.none('insert into stock_items(${this:name}) values(${this:csv})', params);
    }
    return siArray;
}