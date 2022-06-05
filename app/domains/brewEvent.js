import { createUUID } from "../utils/string";
import { BrewPlan } from "./brewPlan";

export class BrewEvent {
  id; // string
  name; // string
  desc; // string
  from; // datetime
  to; // datetime
  ingredients; // array
  brewPlan; // BrewPlan

  constructor(id, name, desc, from, to, ingredients, brewPlan) {
    this.id = id || createUUID();
    this.name = name || "";
    this.desc = desc || "";
    this.from = from || new Date();
    this.to = to || new Date();
    this.ingredients = ingredients || [];
    this.brewPlan = brewPlan || new BrewPlan();
  }
}
