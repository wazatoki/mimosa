import { insert, remove, selectAll, update } from "./recipe";
import { Recipe } from "../domains/recipe";
import { con, none, one } from "./db";
import { createUUID } from '../utils/string';

beforeEach( async () => {
    await none('delete from stock_units');
});

afterAll(() => {
    con.$pool.end();
});

test("recipe insert", async () => {
    
    const recipe = new Recipe("test_name", new Date(2020,1,1))

    const id = await insert(recipe, "test_staff_id_1");
    const result = await one('select name, act_date from recipe where id=$1', id);

    expect(recipe.name).toBe(result.name);
    expect(recipe.actDate).toEqual(result.act_date);

});

test("recipe update", async () => {

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

    await none('insert into recipe(${this:name}) values(${this:csv})', params);

    const recipe = new Recipe("test_name_2", new Date(2020,1,2))
    recipe.id = id


    await update(recipe, "test_staff_id_2");
    const result = await one('select name, act_date from recipe where id=$1', id);

    expect(recipe.name).toBe(result.name);
    expect(recipe.actDate).toEqual(result.act_date);

});

test("recipe remove", async () => {

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

    await none('insert into recipe(${this:name}) values(${this:csv})', params);

    await remove(id, "test_staff_id_2");
    const result = await one('select count(*) from recipe where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});