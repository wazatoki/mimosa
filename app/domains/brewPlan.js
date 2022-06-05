import { createUUID } from "../utils/string";

export class BrewPlan {
  id; // string
  batchNumber; // string
  batchName; // string

  constructor(id, batchNumber, batchName) {
    this.id = id || createUUID();
    this.batchNumber = batchNumber || "";
    this.batchName = batchName || "";
  }
}
