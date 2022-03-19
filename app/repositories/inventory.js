import { createUUID } from '../utils/string';
import { Inventory } from '../domains/stock';
import { StockItemRepo } from './stockItem';

export class InventoryRepo {

    dbBase;

    async insert(inventory, ope_staff_id) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: ope_staff_id,
            operated_at: new Date(),
            operated_by: ope_staff_id,
            act_date: inventory.actDate,
            item_id: inventory.item.id,
            quantity: inventory.quantity
        };

        await this.dbBase.none('insert into inventories(${this:name}) values(${this:csv})', params);

        return params.id
    }

    async update(inventory, ope_staff_id) {

        const params = {
            id: inventory.id,
            created_at: new Date(),
            created_by: ope_staff_id,
            operated_at: new Date(),
            operated_by: ope_staff_id,
            act_date: inventory.actDate,
            item_id: inventory.item.id,
            quantity: inventory.quantity
        };
    
        await this.dbBase.none('update inventories '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by), act_date=$(act_date), item_id=${item_id}, quantity=${quantity} '
            + 'where id=$(id)', params);
    }

    async remove(id, ope_staff_id) {

        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: ope_staff_id
        };
    
        await this.dbBase.none('update inventories '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    }
    
    async selectAll() {
        const result = await this.dbBase.manyOrNone('select id, act_date, item_id, quantity from inventories where del=false order by act_date');
        const stockItemRepo = new StockItemRepo(this.dbBase)
        const items = await stockItemRepo.selectAll();
        return result.map(data => {
            const inv = new Inventory();
            inv.id = data.id;
            inv.item = items.find(item => data.item_id === item.id);
            inv.actDate = data.act_date;
            inv.quantity = Number(data.quantity);
            return inv;
        });
    }

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}