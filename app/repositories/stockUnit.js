import { createUUID } from '../utils/string';
import { StockUnit } from '../domains/master';

export class StockUnitRepo {

    dbBase;

    async insert(stockUnit, opeStaffID) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: stockUnit.name
        };
    
        await this.dbBase.none('insert into stock_units(${this:name}) values(${this:csv})', params);
    
        return params.id
    }    

    async update(stockUnit, opeStaffID) {

        const params = {
            id: stockUnit.id,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: stockUnit.name
        };
    
        await this.dbBase.none('update stock_units '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by), name=$(name) '
            + 'where id=$(id)', params);
    }

    async remove(id, opeStaffID) {

        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update stock_units '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    }

    async selectAll() {
        const result = await this.dbBase.manyOrNone('select id, name from stock_units where del=false order by created_at');
        return result.map(data => {
            const su = new StockUnit();
            su.id = data.id;
            su.name = data.name;
            return su;
        });
    }

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}