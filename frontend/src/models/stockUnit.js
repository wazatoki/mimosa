import { createUUID } from "@/utils/string";

export class StockUnit {
    id; // string
    name; // string

    constructor(id, name) {
        this.id = id || createUUID();
        this.name = name || "";
    }
}