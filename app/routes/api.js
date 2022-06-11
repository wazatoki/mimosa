import { Router } from 'express';
import { DBbase, createConnection } from '../repositories/db';
import { BrewPlanRepo } from '../repositories/brewPlan';
import * as brewingPlanUsecase from '../usecaces/brewingPlan';
import { BrewPlan } from '../domains/brewPlan'

var router = Router();
const dbBase = new DBbase(createConnection());

/* POST createBrewPlan to create */
router.post('/createBrewPlan', function(req, res, next) {
  
  const plan = req.body;
  const brewPlanRepo = new BrewPlanRepo(dbBase);
  const brewPlan = new BrewPlan(plan.id || '', plan.batchNumber || '', plan.batchName || '');
  const createdBrewPlan = brewingPlanUsecase.save(brewPlan, brewPlanRepo, plan.authorizedUserID || '');
  res.json(createdBrewPlan);
});

export default router;
