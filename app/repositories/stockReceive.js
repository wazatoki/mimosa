import { createUUID } from '../utils/string';
import { manyOrNone, none } from './db';
import { StockRecieve } from '../domains/stockReceive'

export async function insert(stockRecieve, ope_staff_id) {

    const params = {
        id: createUUID(),
        created_at: new Date(),
        created_by: ope_staff_id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        name: stockRecieve.name,
        slip_id: stockRecieve.slipID,
        slip_date: stockRecieve.slipDate,
        picture_path: stockRecieve.picturePath
    };

    await none('insert into stock_receive(${this:name}) values(${this:csv})', params);

    return params.id
}

export async function update(stockRecieve, ope_staff_id) {

    const params = {
        id: stockRecieve.id,
        created_at: new Date(),
        created_by: ope_staff_id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        name: stockRecieve.name,
        slip_id: stockRecieve.slipID,
        slip_date: stockRecieve.slipDate,
        picture_path: stockRecieve.picturePath
    };

    await none('update stock_receive '
        + 'set operated_at=$(operated_at), operated_by=$(operated_by), name=$(name), slip_id=$(slip_id), '
        + 'slip_date=${slip_date}, picture_path=${picture_path} '
        + 'where id=$(id)', params);
}

export async function remove(id, ope_staff_id) {

    const params = {
        id: id,
        del: true,
        operated_at: new Date(),
        operated_by: ope_staff_id
    };

    await none('update stock_receive '
        + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
}

export async function selectAll() {
    const result = await manyOrNone('select id, name, slip_id, slip_date, picture_path from stock_receive where del=false order by slip_date');
    return result.map(data => {
        const sr = new StockRecieve(data.name, data.slip_id, data.slip_date, data.picture_path);
        sr.id = data.id;
        return sr;
    });
}