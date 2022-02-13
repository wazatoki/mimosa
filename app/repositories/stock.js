import {pgp} from 'pg-promise'
import { createUUID } from '../utils/string'

export class StockRepository {

    db

    insert(stockLog){

        var params
        params = {id: createUUID(), 
            act_date: stockLog.actDate,
            item_id: stockLog.item.id,
            receiving_quantity: stockLog.receivingQuantity,
            shipping_quantity: stockLog.shippingQuantity,
            description: stockLog.description};

        this.db.none('insert into stock_logs(${this:name}) values(${this:csv})', params);
        
        return params.id
    }

    constructor(){
        this.db = pgp('postgres://brewing_support:brewing_support@brewing_support_db:5432/brewing_supportdb')
    }
}