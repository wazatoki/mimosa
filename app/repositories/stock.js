import { createUUID } from '../utils/string'

export function insert(stockLog, con) {

    var params
    params = {
        id: createUUID(),
        act_date: stockLog.actDate,
        item_id: stockLog.item.id,
        receiving_quantity: stockLog.receivingQuantity,
        shipping_quantity: stockLog.shippingQuantity,
        description: stockLog.description
    };

    con.none('insert into stock_logs(${this:name}) values(${this:csv})', params);

    return params.id
}