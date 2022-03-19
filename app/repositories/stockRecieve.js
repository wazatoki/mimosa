import { createUUID } from '../utils/string';
import { StockRecieve } from '../domains/stockReceive'
import { StockRepo } from './stock'

export class StockRecieveRepo {

    dbBase;

    async insert(stockRecieve, opeStaffID) {

        const stockRepo = new StockRepo(this.dbBase);

        const params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: stockRecieve.name,
            slip_id: stockRecieve.slipID,
            slip_date: stockRecieve.slipDate,
            picture_path: stockRecieve.picturePath
        };
    
        await this.dbBase.none('insert into stock_receive(${this:name}) values(${this:csv})', params);
    
        stockRecieve.id = params.id;
    
        stockRecieve.stockLogs.forEach( async stocklog => {
    
            stocklog.type = 0
            stocklog.stockReceive = stockRecieve;
            await stockRepo.insert(stocklog, opeStaffID);
    
        });
    
        return params.id
    }
    
    async update(stockRecieve, opeStaffID) {

        const stockRepo = new StockRepo(this.dbBase);
    
        const params = {
            id: stockRecieve.id,
            created_at: new Date(),
            created_by: opeStaffID,
            operated_at: new Date(),
            operated_by: opeStaffID,
            name: stockRecieve.name,
            slip_id: stockRecieve.slipID,
            slip_date: stockRecieve.slipDate,
            picture_path: stockRecieve.picturePath
        };
    
        await this.dbBase.none('update stock_receive '
            + 'set operated_at=$(operated_at), operated_by=$(operated_by), name=$(name), slip_id=$(slip_id), '
            + 'slip_date=${slip_date}, picture_path=${picture_path} '
            + 'where id=$(id)', params);
    
        await stockRepo.removeByStockReceiveID(params.id, opeStaffID)
    
        stockRecieve.stockLogs.forEach( async stocklog => {
    
            stocklog.type = 0;
            stocklog.stockReceive = stockRecieve;
            await stockRepo.insert(stocklog, opeStaffID);
    
        });
    }
    
    async remove(id, opeStaffID) {
    
        const stockRepo = new StockRepo(this.dbBase);
        
        const params = {
            id: id,
            del: true,
            operated_at: new Date(),
            operated_by: opeStaffID
        };
    
        await this.dbBase.none('update stock_receive '
            + 'set del=true, operated_at=$(operated_at), operated_by=$(operated_by) where id=$(id)', params);
    
        await stockRepo.removeByStockReceiveID(params.id, opeStaffID)
    }
    
    async selectAll() {

        const result = await this.dbBase.manyOrNone('select '
            +'id, name, slip_id, slip_date, picture_path from stock_receive where del=false order by slip_date');

        return result.map(data => {
            const sr = new StockRecieve(data.name, data.slip_id, data.slip_date, data.picture_path);
            sr.id = data.id;
            return sr;
        });
    }

    constructor(dbBase) {

        this.dbBase = dbBase;

    }
}