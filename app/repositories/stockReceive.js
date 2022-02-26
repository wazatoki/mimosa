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