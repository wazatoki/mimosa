import { StockItem } from "../domains/master";
import { StockUnitRepo } from "./stockUnit"
import { createUUID } from "../utils/string";

export class StockItemRepo {

    dbBase;

    async insert(stockItem, opeStaffID) {

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: stockItem.name,
            receiving_unit_id: stockItem.receivingUnit.id,
            receiving_conversion_factor: stockItem.receivingUnitConversionFactor,
            brewing_unit_id: stockItem.brewingUnit.id,
            brewing_conversion_factor: stockItem.brewingUnitConversionFactor,
            stock_unit_id: stockItem.stockUnit.id,
            stock_conversion_factor: stockItem.stockUnitConversionFactor,
            base_unit_id: stockItem.baseUnit.id
        };
    
        await this.dbBase.none('insert into stock_items(${this:name}) values(${this:csv})', params);
    
        return params.id
    }
    
    async update(stockItem, opeStaffID) {
        
        const params = {
            id: stockItem.id,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: stockItem.name,
            receiving_unit_id: stockItem.receivingUnit.id,
            receiving_conversion_factor: stockItem.receivingUnitConversionFactor,
            brewing_unit_id: stockItem.brewingUnit.id,
            brewing_conversion_factor: stockItem.brewingUnitConversionFactor,
            stock_unit_id: stockItem.stockUnit.id,
            stock_conversion_factor: stockItem.stockUnitConversionFactor,
            base_unit_id: stockItem.baseUnit.id
        };
    
        await this.dbBase.none('update stock_items '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by),'
            + 'name=$(name),'
            + 'receiving_unit_id=$(receiving_unit_id),'
            + 'receiving_conversion_factor=$(receiving_conversion_factor),'
            + 'brewing_unit_id=$(brewing_unit_id),'
            + 'brewing_conversion_factor=$(brewing_conversion_factor),'
            + 'stock_unit_id=$(stock_unit_id),'
            + 'stock_conversion_factor=$(stock_conversion_factor),'
            + 'base_unit_id=$(base_unit_id) '
            + 'where id=$(id)', params);
    }
    
    async remove(id, opeStaffID) {
        
        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update stock_items '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    }

    async selectAll() {

        const result = await this.dbBase.manyOrNone('select id, name,'
            + 'receiving_unit_id, receiving_conversion_factor, brewing_unit_id, brewing_conversion_factor,'
            + 'stock_unit_id, stock_conversion_factor, base_unit_id from '
            + 'stock_items where del=false '
            + 'order by created_at');
    
        const stockUnitRepo = new StockUnitRepo(this.dbBase);
        const stockUnits = await stockUnitRepo.selectAll();
    
        return result.map(data => {
    
            const si = new StockItem()
            si.id = data.id;
            si.name = data.name;
            si.receivingUnit = stockUnits.find(unit => unit.id === data.receiving_unit_id);
            si.receivingUnitConversionFactor = data.receiving_conversion_factor;
            si.brewingUnit = stockUnits.find(unit => unit.id === data.brewing_unit_id);
            si.brewingUnitConversionFactor = data.brewing_conversion_factor;
            si.stockUnit = stockUnits.find(unit => unit.id === data.stock_unit_id);
            si.stockUnitConversionFactor = data.stock_conversion_factor;
            si.baseUnit = stockUnits.find(unit => unit.id === data.base_unit_id);
    
            return si;
        });
    }

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}