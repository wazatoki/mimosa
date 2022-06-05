import { createUUID } from '../utils/string';
import { BrewEvent } from '../domains/brewEvent';
import { BrewPlanRepo } from './brewPlan';

export class BrewEventRepo {

    dbBase;

    async insert(brewEvent, opeStaffID) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: brewEvent.name,
            description: brewEvent.desc,
            from_dt: brewEvent.from,
            to_dt: brewEvent.to,
            brew_plan_id: brewEvent.brewPlan.id
        };
    
        await this.dbBase.none('insert into brew_events(${this:name}) values(${this:csv})', params);
    
        return params.id
    }    

    async update(brewEvent, opeStaffID) {

        const params = {
            id: brewEvent.id,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: brewEvent.name,
            description: brewEvent.desc,
            from_dt: brewEvent.from,
            to_dt: brewEvent.to,
            brew_plan_id: brewEvent.brewPlan.id
        };

        await this.dbBase.none('update brew_events '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by), name=$(name), description=$(description), from_dt=$(from_dt), to_dt=$(to_dt), brew_plan_id=$(brew_plan_id) '
            + 'where id=$(id)', params);
    }

    async remove(id, opeStaffID) {

        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update brew_events '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    }

    async selectAll() {
        const bpr = new BrewPlanRepo(this.dbBase);
        const brewPlans = await bpr.selectAll()
        const result = await this.dbBase.manyOrNone('select id, name, description, from_dt, to_dt, brew_plan_id from brew_events where del=false order by created_at');
        return result.map(data => {
            const be = new BrewEvent();
            be.id = data.id;
            be.name = data.name;
            be.desc = data.description;
            be.from = data.from_dt;
            be.to = data.to_dt;
            be.brewPlan = brewPlans.find( item => data.brew_plan_id === item.id);
            return be;
        });
    }

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}