import { StockItem } from "../domains/master";
import { selectAll as selectAllUnits } from "./stockUnit"
import { manyOrNone, none } from './db';
import { createUUID } from "../utils/string";

export async function insert(stockItem, ope_staff_id) {

    const params = {
        id: createUUID(),
        created_at: new Date(),
        created_by: ope_staff_id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        name: stockItem.name,
        receiving_unit_id: stockItem.receivingUnit.id,
        shipping_unit_id: stockItem.shippingUnit.id,
        stock_unit_id: stockItem.stockUnit.id,
        base_unit_id: stockItem.baseUnit.id
    };

    await none('insert into stock_items(${this:name}) values(${this:csv})', params);

    return params.id
}

export async function update(stockItem, ope_staff_id) {
    
    const params = {
        id: stockItem.id,
        operated_at: new Date(),
        operated_by: ope_staff_id,
        name: stockItem.name,
        receiving_unit_id: stockItem.receivingUnit.id,
        shipping_unit_id: stockItem.shippingUnit.id,
        stock_unit_id: stockItem.stockUnit.id,
        base_unit_id: stockItem.baseUnit.id
    };

    await none('update stock_items '
        + 'set operated_at=$(operated_at), operated_by=$(operated_by), name=$(name), receiving_unit_id=$(receiving_unit_id),'
        + 'shipping_unit_id=$(shipping_unit_id), stock_unit_id=$(stock_unit_id), base_unit_id=$(base_unit_id)'
        + 'where id=$(id)', params);
}

export async function remove(id, ope_staff_id) {
    
    const params = {
        id: id,
        del: true,
        operated_at: new Date(),
        operated_by: ope_staff_id
    };

    await none('update stock_items '
        + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
}

export async function selectAll() {

    const result = await manyOrNone('select id, name, receiving_unit_id, shipping_unit_id, stock_unit_id, base_unit_id from '
        + 'stock_items where del=false '
        + 'order by created_at');

    const stockUnits = await selectAllUnits();

    return result.map(data => {

        const si = new StockItem()
        si.id = data.id;
        si.name = data.name;
        si.receivingUnit = stockUnits.find(unit => unit.id === data.receiving_unit_id);
        si.shippingUnit = stockUnits.find(unit => unit.id === data.shipping_unit_id);
        si.stockUnit = stockUnits.find(unit => unit.id === data.stock_unit_id);
        si.baseUnit = stockUnits.find(unit => unit.id === data.base_unit_id);

        return si;
    });
}