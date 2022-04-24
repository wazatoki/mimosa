import * as db from "./db";
import { StaffRepo } from './staff';
import { Staff } from '../domains/authorization';
import { createUUID } from '../utils/string';

const d = new db.DBbase(db.createConnection());

beforeEach( async () => {
    await d.none('delete from staffs');
});

afterAll(() => {
    d.con.$pool.end();
});

test("staffs insert", async () => {
    
    const staffRepo = new StaffRepo(d);
    const staff = new Staff('test_user_id', 'test_pass_word');

    const id = await staffRepo.insert(staff, "test_op_staff_id_1");
    const result = await d.one('select id, user_id, password from staffs where id=$1', id);

    expect(staff.userID).toBe(result.user_id);
    expect(staff.password).toBe(result.password);

});

test("staffs update", async () => {

    const staffRepo = new StaffRepo(d);
    const staff = new Staff('test_user_id', 'test_pass_word');

    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        user_id: "test_user_id",
        password: "test_pass_word"
    };

    await d.none('insert into staffs(${this:name}) values(${this:csv})', params);

    staff.id = id;
    staff.userID = "updated_test_user_id";
    staff.password= "updated_pass_word";

    await staffRepo.update(staff, "test_staff_id_2");
    const result = await d.one('select id, user_id, password from staffs where id=$1', id);

    expect(staff.userID).toBe(result.user_id);
    expect(staff.password).toBe(result.password);

});

test("staffs remove", async () => {

    const staffRepo = new StaffRepo(d);
    const id = createUUID();
    const params = {
        id: id,
        created_at: new Date(),
        created_by: "test_staff_id_1",
        operated_at: new Date(),
        operated_by: "test_staff_id_1",
        user_id: "test_user_id",
        password: "test_pass_word"
    };

    await d.none('insert into staffs(${this:name}) values(${this:csv})', params);

    await staffRepo.remove(id, "test_staff_id_2");
    const result = await d.one('select count(*) from staffs where del=false and id=$1', id);

    expect(0).toBe(Number(result.count));
});

test("staffs selectAll", async () => {

    const staffRepo = new StaffRepo(d);
    const staffArray = [];
    for(let i = 0; i < 10; i++){

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            user_id: "test_user_id_" + i,
            password: "test_pass_word_" + i
        };

        let staff = new Staff('test_user_id_' + i, 'test_pass_word_' + i);
        staff.id = params.id;
        staffArray.push(staff)

        await d.none('insert into staffs(${this:name}) values(${this:csv})', params);
    }

    const result = await staffRepo.selectAll()

    expect(staffArray).toEqual(result);
});