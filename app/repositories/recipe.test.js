import { RecipeRepo } from "./recipe";
import { Recipe } from "../domains/recipe";
import { StockLogEntity } from '../domains/stock'
import { StockItem, StockUnit} from '../domains/master'
import * as db from "./db";
import { createUUID } from '../utils/string';

const d = new db.DBbase(db.createConnection());

beforeEach( async () => {
    await d.none('delete from recipe');
});

afterAll(() => {
    d.con.$pool.end();
});

test("recipe insert", async () => {

    const recipeRepo = new RecipeRepo(d);
    const su = new StockUnit();
        su.id = 'test_unit_id';
        su.name = 'test_unit_name_id';
        su.conversionFactor = 1;

    const si = new StockItem()
        si.id = 'test_item_id_1';
        si.name = 'test_item_name_1';
        si.receivingUnit = su
        si.shippingUnit = su
        si.stockUnit = su
        si.baseUnit = su

    const stockLogEntity = new StockLogEntity()

    stockLogEntity.actDate = new Date(2020, 1, 1);
    stockLogEntity.item = si;
    stockLogEntity.receivingQuantity = 0;
    stockLogEntity.shippingQuantity = 50.5;
    stockLogEntity.description = 'sample_comment_1';
    stockLogEntity.type = 1;
    
    const recipe = new Recipe("test_name", new Date(2020,1,1));
    recipe.stockLogs.push(stockLogEntity);

    const id = await recipeRepo.insert(recipe, "test_staff_id_1");
    const result = await d.one('select name, act_date from recipe where id=$1', id);
    const result1 = await d.one('select act_date, item_id, receiving_quantity, description, type from stock_logs where recipe_id=$1', id);

    expect(recipe.name).toBe(result.name);
    expect(recipe.actDate).toEqual(result.act_date);

    expect(stockLogEntity.actDate).toEqual(result1.act_date);
    expect(stockLogEntity.item.id).toBe(result1.item_id);
    expect(stockLogEntity.receivingQuantity).toBe(Number(result1.receiving_quantity));
    expect(stockLogEntity.description).toBe(result1.description);
    expect(stockLogEntity.type).toBe(Number(result1.type));

});

test("recipe update", async () => {

    const recipeRepo = new RecipeRepo(d);
    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name_1",
        act_date: new Date(2020,1,1)
    };

    await d.none('insert into recipe(${this:name}) values(${this:csv})', params);

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
            recipe_id: id
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
        si.shippingUnit = su
        si.stockUnit = su
        si.baseUnit = su

    const stockLogEntity = new StockLogEntity()

    const recipe = new Recipe("test_name_2", new Date(2020,1,2))
    recipe.id = id
    recipe.stockLogs.push(stockLogEntity);

    await recipeRepo.update(recipe, "test_staff_id_2");
    const result = await d.one('select name, act_date from recipe where id=$1', id);
    const result1 = await d.one('select act_date, item_id, receiving_quantity, description, type from stock_logs where del = false and recipe_id=$1', id);
    const result2 = await d.one('select count(*) as count from stock_logs where del = false and recipe_id=$1', id);

    expect(recipe.name).toBe(result.name);
    expect(recipe.actDate).toEqual(result.act_date);

    expect(stockLogEntity.actDate).toEqual(result1.act_date);
    expect(stockLogEntity.item.id).toBe(result1.item_id);
    expect(stockLogEntity.receivingQuantity).toBe(Number(result1.receiving_quantity));
    expect(stockLogEntity.description).toBe(result1.description);
    expect(stockLogEntity.type).toBe(Number(result1.type));
    expect(1).toBe(Number(result2.count));

});

test("recipe remove", async () => {

    const recipeRepo = new RecipeRepo(d);
    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: "test_name_1",
        act_date: new Date(2020,1,1)
    };

    await d.none('insert into recipe(${this:name}) values(${this:csv})', params);

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
            recipe_id: id
        };
        await d.none('insert into stock_logs(${this:name}) values(${this:csv})', params);
    }

    await recipeRepo.remove(id, "test_staff_id_2");
    const result = await d.one('select count(*) from recipe where del=false and id=$1', id);
    const result1 = await d.one('select count(*) as count from stock_logs where del = false and recipe_id=$1', id);

    expect(0).toBe(Number(result.count));
    expect(0).toBe(Number(result1.count));
});

test("recipe selectAll", async () => {

    const recipeRepo = new RecipeRepo(d);
    const reArray = [];
    for(let i = 0; i < 10; i++){

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            act_date: new Date(2020,1,i),
        };

        let re = new Recipe(params.name, params.act_date);
        re.id = params.id;
        reArray.push(re);

        await d.none('insert into recipe(${this:name}) values(${this:csv})', params);
    }

    const result = await recipeRepo.selectAll()

    const sortedArray = reArray.sort( (a, b) => {
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