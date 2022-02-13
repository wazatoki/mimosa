import { StockLog } from "../domains/stock"

export function recieve(stockLog, repo) { 
    var id;
    id = repo.insert(stockLog);
}

export function ship(stockLog, repo) { 
    var id;
    id = repo.insert(stockLog)
}

export function inventory(latestInventory, stockLogs, toDate) {

    var stockLog = new StockLog(stockLogs)

    return stockLog.inventoryResult(latestInventory, toDate)
}