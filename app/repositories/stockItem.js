import { StockItem } from "../domains/master";
import { selectAll as selectAllUnits } from "./stockUnit"
import { manyOrNone, none } from './db';

export async function selectAll() {

    const result = await manyOrNone('select id, name, receiving_unit_id, shipping_unit_id, stock_unit_id, base_unit_id from '
        + 'stock_items where del=false');

    const stockUnits = await selectAllUnits();

    return result.map(data => {

        const si = new StockItem()
        si.id = data.id;
        si.name = data.name;
        si.receivingUnit = stockUnits.find(unit => unit.id === data.receiving_unit_id);
        si.shippigUnit = stockUnits.find(unit => unit.id === data.shipping_unit_id);
        si.stockUnit = stockUnits.find(unit => unit.id === data.stock_unit_id);
        si.baseUnit = stockUnits.find(unit => unit.id === data.base_unit_id);

        return si;
    });
}