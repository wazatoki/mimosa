import { createUUID } from "@/utils/string";

export class BrewEvent {
  id; // string
  name; // string
  desc; // string
  from; // datetime
  to; // datetime
  ingredients; // array
  batchNumber; // Number

  constructor(id, name, desc, from, to, ingredients, batchNumber) {
      this.id = id || createUUID();
      this.name = name || '';
      this.desc = desc || '';
      this.from = from || new Date();
      this.to = to || new Date();
      this.ingredients = ingredients || [];
      this.batchNumber = batchNumber || 0;
  }
}
