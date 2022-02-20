import { createUUID } from '../utils/string'
import { none } from './db';

export async function insert(stockLogEntity, ope_staff_id) {

    const params = {
        id: createUUID(),
        created_at: new Date(),
        created_by: ope_staff_id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        act_date: stockLogEntity.actDate,
        item_id: stockLogEntity.item.id,
        receiving_quantity: stockLogEntity.receivingQuantity,
        shipping_quantity: stockLogEntity.shippingQuantity,
        description: stockLogEntity.description
    };

    await none('insert into stock_logs(${this:name}) values(${this:csv})', params);

    return params.id
}

export async function update(stockLogEntity, ope_staff_id) {
    
    const params = {
        id: stockLogEntity.id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        act_date: stockLogEntity.actDate,
        item_id: stockLogEntity.item.id,
        receiving_quantity: stockLogEntity.receivingQuantity,
        shipping_quantity: stockLogEntity.shippingQuantity,
        description: stockLogEntity.description
    };

    await none('update stock_logs '
        + 'set operated_at=$(operated_at), operated_by=$(operated_by), act_date=$(act_date), item_id=$(item_id),'
        + 'receiving_quantity=$(receiving_quantity), shipping_quantity=$(shipping_quantity), description=$(description)'
        + 'where id=$(id)', params);
}

export async function remove(id, ope_staff_id) {
    
    const params = {
        id: id,
        del: true,
        operated_at: new Date(),
        operated_by: ope_staff_id
    };

    await none('update stock_logs '
        + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
}