import { createUUID } from '../utils/string';
import  'date-utils';
import { connect } from './db';



export async function insert(stockUnit, ope_staff_id) {

    const con = connect()
    const params = {
        id: createUUID(),
        created_at: new Date(),
        created_by: ope_staff_id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        name: stockUnit.name,
        conversion_factor: stockUnit.conversionFactor
    };

    await con.none('insert into stock_units(${this:name}) values(${this:csv})', params);
    con.$pool.end()

    return params.id
}

export async function update(stockUnit, ope_staff_id) {
    
    const con = connect()
    const params = {
        id: stockUnit.id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        name: stockUnit.name,
        conversion_factor: stockUnit.conversionFactor
    };

    await con.none('update stock_units '
        + 'set operated_at=$(operated_at), operated_by=$(operated_by), name=$(name), conversion_factor=$(conversion_factor) '
        + 'where id=$(id)', params);
    con.$pool.end()
}