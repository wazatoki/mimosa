export async function save(brewPlan, brewPlanRepo, opeStaffID) {
  brewPlan.id = await brewPlanRepo.insert(brewPlan, opeStaffID);
  return brewPlan;
}

export async function fetch() {
    brewPlans = await brewPlanRepo.selectAll();
    return brewPlans;
  }
  