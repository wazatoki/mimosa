import { StockLog } from "../domains/stock"

export function recieve(stockRecieve, stockRecieveRepo, stockRepo) { 
    stockRecieve.id = stockRecieveRepo.insert(stockRecieve);
}

export function ship(stockLog, repo) { 
    const id = repo.insert(stockLog)
}

export function inventory(latestInventory, stockLogs, toDate) {

    const stockLog = new StockLog(stockLogs)

    return stockLog.inventoryResult(latestInventory, toDate)
}