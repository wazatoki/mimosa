import { Router } from 'express';
import { DBbase, createConnection } from '../repositories/db';
import { StockRecieveRepo } from '../repositories/stockRecieve';
import * as useStock from '../usecaces/stock';
import { StockRecieve } from '../domains/stockReceive'

var router = Router();
const dbBase = new DBbase(createConnection());

/* POST stockRecieve to create */
router.post('/stockRecieve', function(req, res, next) {
  
  const p = req.body;
  const stockRecieveRepo = new StockRecieveRepo(dbBase)
  const stockRecieve = new StockRecieve(p.name, p.slipID, p.slipDate, )
  const sr2 = useStock.recieve(stockRecieve, stockRecieveRepo, )
  res.json();
});

export default router;
