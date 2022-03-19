import { StockLog } from "../domains/stock"

export async function recieve(stockRecieve, stockRecieveRepo, opeStaffID) { 
    stockRecieve.id = await stockRecieveRepo.insert(stockRecieve, opeStaffID);
    return stockRecieve;
}

export function ship(stockLog, repo) { 
    const id = repo.insert(stockLog)
}

export function inventory(latestInventory, stockLogs, toDate) {

    const stockLog = new StockLog(stockLogs)

    return stockLog.inventoryResult(latestInventory, toDate)
}