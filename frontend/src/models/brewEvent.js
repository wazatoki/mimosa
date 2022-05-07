import { createUUID } from "@/utils/string";

export class BrewEvent {
  id; // string
  name; // string
  desc; // string
  from; // datetime
  to; // datetime
  ingredients; // array

  constructor(id, name, desc, from, to, ingredients) {
      this.id = id || createUUID();
      this.name = name || '';
      this.desc = desc || '';
      this.from = from || new Date();
      this.to = to || new Date();
      this.ingredients = ingredients || [];
  }
}
