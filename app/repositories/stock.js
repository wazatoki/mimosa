import { StockLogEntity } from '../domains/stock';
import { createUUID } from '../utils/string';
import { selectAll as selectAllItems } from './stockItem';
import { selectAll as selectAllRecipes } from './recipe'
import { selectAll as selectAllStockReceives } from './stockReceive'
import { manyOrNone, none } from './db';

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
        description: stockLogEntity.description,
        type: stockLogEntity.type
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
        description: stockLogEntity.description,
        type: stockLogEntity.type
    };

    await none('update stock_logs '
        + 'set operated_at=$(operated_at), operated_by=$(operated_by), act_date=$(act_date), item_id=$(item_id),'
        + 'receiving_quantity=$(receiving_quantity), shipping_quantity=$(shipping_quantity), description=$(description),'
        + 'type=${type}'
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

export async function selectAll(){
    const result = await manyOrNone('select '
        + 'id, act_date, item_id, receiving_quantity, shipping_quantity, description, type, recipe_id, stock_receive_id '
        + 'from stock_logs where del=false '
        + 'order by created_at');
    const items = await selectAllItems();
    const stockRecieveList = await selectAllStockReceives();
    const recipes = await selectAllRecipes();

    return result.map(data => {
        const s = new StockLogEntity();
        s.id = data.id;
        s.actDate = data.act_date;
        s.item = items.find( item => data.item_id === item.id);
        s.receivingQuantity = Number(data.receiving_quantity);
        s.shippingQuantity = Number(data.shipping_quantity);
        s.description = data.description;
        s.type = Number(data.type);
        s.stockReceive = stockRecieveList.find( item => data.stock_receive_id === item.id);
        s.recipe = recipes.find( item => data.recipe_id === item.id);
        return s;
    });
}