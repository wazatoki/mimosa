import { createUUID } from '../utils/string';
import { Recipe } from '../domains/recipe'
import { StockRepo } from './stock'

export class RecipeRepo {

    dbBase;

    async insert(recipe, opeStaffID) {

        const stockRepo = new StockRepo(this.dbBase)
        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: recipe.name,
            act_date: recipe.actDate
        };
    
        await this.dbBase.none('insert into recipe(${this:name}) values(${this:csv})', params);
    
        recipe.id = params.id
    
        recipe.stockLogs.forEach( async stocklog => {
    
            stocklog.type = 1
            stocklog.recipe = recipe;
            await stockRepo.insert(stocklog, opeStaffID);
    
        });
    
        return params.id
    }
    
    async update(recipe, opeStaffID) {
    
        const stockRepo = new StockRepo(this.dbBase)
        const params = {
            id: recipe.id,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: recipe.name,
            act_date: recipe.actDate
        };
    
        await this.dbBase.none('update recipe '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by), name=$(name), act_date=$(act_date) '
            + 'where id=$(id)', params);
    
        await stockRepo.removeByRecipeID(params.id, opeStaffID)
    
        recipe.stockLogs.forEach( async stocklog => {
    
            stocklog.type = 1;
            stocklog.recipe = recipe;
            await stockRepo.insert(stocklog, opeStaffID);
    
        });
    }
    
    async remove(id, opeStaffID) {
    
        const stockRepo = new StockRepo(this.dbBase)
        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update recipe '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    
        await stockRepo.removeByRecipeID(params.id, opeStaffID)
    }
    
    async selectAll() {
        const result = await this.dbBase.manyOrNone('select id, name, act_date from recipe where del=false order by act_date');
        return result.map(data => {
            const r = new Recipe(data.name, data.act_date);
            r.id = data.id;
            return r;
        });
    }

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}