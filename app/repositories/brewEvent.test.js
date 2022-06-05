import * as db from "./db";
import { BrewEventRepo } from './brewEvent';
import { BrewEvent } from '../domains/brewEvent';
import { createUUID } from '../utils/string';

const d = new db.DBbase(db.createConnection());

beforeEach( async () => {
    await d.none('delete from brew_events');
});

afterAll(() => {
    d.con.$pool.end();
});

test("brew_events insert", async () => {
    
    const brewEventRepo = new BrewEventRepo(d);
    const brewEvent = new BrewEvent('test_brew_event_id', 'test_name', 'test_desc', new Date(2020, 11, 17, 1, 0, 0), new Date(2020, 11, 17, 2, 0, 0));

    const id = await brewEventRepo.insert(brewEvent, "test_op_staff_id_1");
    const result = await d.one('select id, name, description, from_dt, to_dt, brew_plan_id from brew_events where id=$1', id);

    expect(brewEvent.name).toBe(result.name);
    expect(brewEvent.desc).toBe(result.description);
    expect(brewEvent.from).toEqual(result.from_dt);
    expect(brewEvent.to).toEqual(result.to_dt);
    expect(brewEvent.brewPlan.id).toBe(result.brew_plan_id);
    
});

test("brew_events update", async () => {

    const brewEventRepo = new BrewEventRepo(d);
    const brewEvent = new BrewEvent('test_brew_event_id', 'test_name', 'test_desc', new Date(2020, 11, 17, 1, 0, 0), new Date(2020, 11, 17, 2, 0, 0));

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: brewEvent.name,
        description: brewEvent.desc,
        from_dt: brewEvent.from,
        to_dt: brewEvent.to,
        brew_plan_id: brewEvent.brewPlan.id
    };

    await d.none('insert into brew_events(${this:name}) values(${this:csv})', params);

    brewEvent.id = id;
    brewEvent.name = "test_name_2";
    brewEvent.desc = "test_desc_2";

    await brewEventRepo.update(brewEvent, "test_op_staff_id_1");
    const result = await d.one('select id, name, description, from_dt, to_dt, brew_plan_id from brew_events where id=$1', id);

    expect(brewEvent.name).toBe(result.name);
    expect(brewEvent.desc).toBe(result.description);
    expect(brewEvent.from).toEqual(result.from_dt);
    expect(brewEvent.to).toEqual(result.to_dt);
    expect(brewEvent.brewPlan.id).toBe(result.brew_plan_id);

});

test("brew_events remove", async () => {

    const brewEventRepo = new BrewEventRepo(d);
    const brewEvent = new BrewEvent('test_brew_event_id', 'test_name', 'test_desc', new Date(2020, 11, 17, 1, 0, 0), new Date(2020, 11, 17, 2, 0, 0));
    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        name: brewEvent.name,
        description: brewEvent.desc,
        from_dt: brewEvent.from,
        to_dt: brewEvent.to,
        brew_plan_id: brewEvent.brewPlan.id
    };

    await d.none('insert into brew_events(${this:name}) values(${this:csv})', params);

    await brewEventRepo.remove(id, "test_op_staff_id_1");
    const result = await d.one('select count(*) from brew_events where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("brew_events selectAll", async () => {

    const brewEventRepo = new BrewEventRepo(d);
    const brewEventArray = [];
    for(let i = 1; i < 10; i++){

        let brewEvent = new BrewEvent(createUUID(), 'test_name' + i, 'test_desc' + i, new Date(2020, 11, i, 1, 0, 0), new Date(2020, 11, i, 2, 0, 0));
        brewEventArray.push(brewEvent)

        let brewEventsParams = {
            id: brewEvent.id,
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name:  brewEvent.name,
            description: brewEvent.desc,
            from_dt: brewEvent.from,
            to_dt: brewEvent.to,
            brew_plan_id: brewEvent.brewPlan.id,
        };

        let brewPlansParams = {
            id: brewEvent.brewPlan.id,
            batch_number: '',
            batch_name: '',
        };

        await d.none('insert into brew_plans(${this:name}) values(${this:csv})', brewPlansParams);
        await d.none('insert into brew_events(${this:name}) values(${this:csv})', brewEventsParams);
    }

    const result = await brewEventRepo.selectAll()

    expect(brewEventArray).toEqual(result);
});