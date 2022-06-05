import * as db from "./db";
import { BrewPlanRepo } from './brewPlan';
import { BrewPlan } from '../domains/brewPlan';
import { createUUID } from '../utils/string';

const d = new db.DBbase(db.createConnection());

beforeEach( async () => {
    await d.none('delete from brew_plans');
});

afterAll(() => {
    d.con.$pool.end();
});

test("brew_plans insert", async () => {
    
    const brewPlanRepo = new BrewPlanRepo(d);
    const brewPlan = new BrewPlan('test_brew_plan_id', '1', 'aaaaa');

    const id = await brewPlanRepo.insert(brewPlan, "test_op_staff_id_1");
    const result = await d.one('select id, batch_number, batch_name from brew_plans where id=$1', id);

    expect(brewPlan.batchNumber).toBe(result.batch_number);
    expect(brewPlan.batchName).toBe(result.batch_name);
    
});

test("brew_plans update", async () => {

    const brewPlanRepo = new BrewPlanRepo(d);
    const brewPlan = new BrewPlan('test_brew_plan_id', '1', 'aaaaa');

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        batch_number: "1",
        batch_name: "aaaaa"
    };

    await d.none('insert into brew_plans(${this:name}) values(${this:csv})', params);

    brewPlan.id = id;
    brewPlan.batchNumber = "2";
    brewPlan.batchName= "bbbbb";

    await brewPlanRepo.update(brewPlan, "test_op_staff_id_1");
    const result = await d.one('select id, batch_number, batch_name from brew_plans where id=$1', id);

    expect(brewPlan.batchNumber).toBe(result.batch_number);
    expect(brewPlan.batchName).toBe(result.batch_name);

});

test("brew_plans remove", async () => {

    const brewPlanRepo = new BrewPlanRepo(d);
    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        batch_number: "1",
        batch_name: "aaaaa"
    };

    await d.none('insert into brew_plans(${this:name}) values(${this:csv})', params);

    await brewPlanRepo.remove(id, "test_op_staff_id_1");
    const result = await d.one('select count(*) from brew_plans where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("brew_plans selectAll", async () => {

    const brewPlanRepo = new BrewPlanRepo(d);
    const brewPlanArray = [];
    for(let i = 0; i < 10; i++){

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            batch_number:  String(i),
            batch_name: "aaaaa_" + i,
        };

        let brewPlan = new BrewPlan(params.id, params.batch_number, params.batch_name);
        brewPlanArray.push(brewPlan)

        await d.none('insert into brew_plans(${this:name}) values(${this:csv})', params);
    }

    const result = await brewPlanRepo.selectAll()

    expect(brewPlanArray).toEqual(result);
});