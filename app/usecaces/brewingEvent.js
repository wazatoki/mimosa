export async function save(brewEvent, brewEventRepo, opeStaffID) {
  brewEvent.id = await brewEventRepo.insert(brewEvent, opeStaffID);
  return brewEvent;
}

export async function fetch() {
    brewEvents = await brewEventRepo.selectAll();
    return brewEvents;
  }
  