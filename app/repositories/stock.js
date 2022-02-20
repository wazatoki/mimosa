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