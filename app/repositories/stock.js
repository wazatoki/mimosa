import { StockLogEntity } from '../domains/stock';
import { createUUID } from '../utils/string';
import { StockItemRepo } from './stockItem';
import { RecipeRepo } from './recipe'
import { StockRecieveRepo } from './stockRecieve'

export class StockRepo {

    dbBase;

    async insert(stockLogEntity, opeStaffID) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            act_date: stockLogEntity.actDate,
            item_id: stockLogEntity.item.id,
            receiving_quantity: stockLogEntity.receivingQuantity,
            shipping_quantity: stockLogEntity.shippingQuantity,
            description: stockLogEntity.description,
            type: stockLogEntity.type,
            stock_receive_id: stockLogEntity.stockReceive.id,
            recipe_id: stockLogEntity.recipe.id
        };
    
        await this.dbBase.none('insert into stock_logs(${this:name}) values(${this:csv})', params);
    
        return params.id
    }
    
    async update(stockLogEntity, opeStaffID) {
        
        const params = {
            id: stockLogEntity.id,
            operated_at: new Date(),
            operated_by: opeStaffID,
            act_date: stockLogEntity.actDate,
            item_id: stockLogEntity.item.id,
            receiving_quantity: stockLogEntity.receivingQuantity,
            shipping_quantity: stockLogEntity.shippingQuantity,
            description: stockLogEntity.description,
            type: stockLogEntity.type,
            stock_receive_id: stockLogEntity.stockReceive.id,
            recipe_id: stockLogEntity.recipe.id
        };
    
        await this.dbBase.none('update stock_logs '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by), act_date=$(act_date), item_id=$(item_id),'
            + 'receiving_quantity=$(receiving_quantity), shipping_quantity=$(shipping_quantity), description=$(description),'
            + 'type=${type}'
            + 'where id=$(id)', params);
    }
    
    async remove(id, opeStaffID) {
        
        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update stock_logs '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    }
    
    async removeByStockReceiveID(stockReceiveID, opeStaffID) {
        
        const params = {
            stock_receive_id: stockReceiveID,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update stock_logs '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where stock_receive_id=$(stock_receive_id)', params);
    }
    
    async removeByRecipeID(recipeID, opeStaffID) {
        
        const params = {
            recipe_id: recipeID,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update stock_logs '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where recipe_id=$(recipe_id)', params);
    }
    
    async selectAll(){

        const result = await this.dbBase.manyOrNone('select '
            + 'id, act_date, item_id, receiving_quantity, shipping_quantity, description, type, recipe_id, stock_receive_id '
            + 'from stock_logs where del=false '
            + 'order by created_at');
        const stockItem = new StockItemRepo(this.dbBase);
        const items = await stockItem.selectAll();
        const stockRecieveRepo = new StockRecieveRepo(this.dbBase);
        const stockRecieveList = await stockRecieveRepo.selectAll();
        const recipeRepo = new RecipeRepo(this.dbBase);
        const recipes = await recipeRepo.selectAll();
    
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

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}