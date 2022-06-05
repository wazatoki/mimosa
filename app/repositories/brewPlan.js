import { createUUID } from '../utils/string';
import { BrewPlan } from '../domains/brewPlan';

export class BrewPlanRepo {

    dbBase;

    async insert(brewPlan, opeStaffID) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            batch_number: brewPlan.batchNumber,
            batch_name: brewPlan.batchName
        };
    
        await this.dbBase.none('insert into brew_plans(${this:name}) values(${this:csv})', params);
    
        return params.id
    }    

    async update(brewPlan, opeStaffID) {

        const params = {
            id: brewPlan.id,
            operated_at: new Date(),
            operated_by: opeStaffID,
            batch_number: brewPlan.batchNumber,
            batch_name: brewPlan.batchName
        };

        await this.dbBase.none('update brew_plans '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by), batch_number=$(batch_number), batch_name=$(batch_name) '
            + 'where id=$(id)', params);
    }

    async remove(id, opeStaffID) {

        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update brew_plans '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    }

    async selectAll() {
        const result = await this.dbBase.manyOrNone('select id, batch_number, batch_name from brew_plans where del=false order by created_at');
        return result.map(data => {
            const bp = new BrewPlan();
            bp.id = data.id;
            bp.batchNumber = data.batch_number;
            bp.batchName = data.batch_name;
            
            return bp;
        });
    }

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}