import * as db from './db';

const con = {
    none: jest.fn(),
    one: jest.fn(),
    manyOrNone: jest.fn(),
};

test("db.none shuld call con.none", async () => {
    
    const DB = new db.DBbase(con);

    await DB.none("sql str ... ", {});
    expect(con.none).toHaveBeenCalled();

});

test("db.one shuld call con.one", async () => {
    
    const DB = new db.DBbase(con);

    await DB.one("sql str ... ", {});
    expect(con.one).toHaveBeenCalled();

});

test("db.manyOrNone shuld call con.manyOrNone", async () => {
    
    const DB = new db.DBbase(con);

    await DB.manyOrNone("sql str ... ", {});
    expect(con.manyOrNone).toHaveBeenCalled();

});