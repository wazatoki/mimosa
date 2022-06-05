export class BrewPlan {
  id; // string
  batchNumber; // string
  batchName; // string

  constructor(id, batchNumber, batchName) {
      this.id = id || '';
      this.batchNumber = batchNumber || "";
      this.batchName = batchName || "";
  }
}
