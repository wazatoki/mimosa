import { Inventory, StockLog, StockLogEntity } from "./stock";
import { createUUID } from "../utils/string";
import { StockUnit, StockItem } from "./master";

test("StockLog inventoryResult", async () => {

    const suArray = [];
    for (let i = 0; i < 5; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            conversion_factor: i + 1
        };

        let su = new StockUnit();
        su.id = params.id;
        su.name = params.name;
        su.conversionFactor = params.conversion_factor;
        suArray.push(su);
    }

    const siArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            name: "test_name_" + i,
            receiving_unit_id: suArray[0].id,
            shipping_unit_id: suArray[1].id,
            stock_unit_id: suArray[0].id,
            base_unit_id: suArray[0].id
        };

        let si = new StockItem()
        si.id = params.id;
        si.name = params.name;
        si.receivingUnit = suArray[0]
        si.shippigUnit = suArray[1]
        si.stockUnit = suArray[0]
        si.baseUnit = suArray[0]
        siArray.push(si);
    }

    const sArray = [];
    for (let i = 0; i < 10; i++) {

        let params = {
            id: createUUID(),
            created_at: new Date(),
            created_by: "test_staff_id_" + i,
            operated_at: new Date(),
            operated_by: "test_staff_id_" + i,
            act_date: new Date(2020, 1, i + 1),
            item_id: siArray[(i + 7) % 8].id,
            receiving_quantity: 10,
            shipping_quantity: 2,
            description: 'sample_comment_' + i
        };

        let s = new StockLogEntity()
        s.id = params.id;
        s.actDate = params.act_date;
        s.item = siArray[(i + 7) % 2];
        s.receivingQuantity = params.receiving_quantity;
        s.shippingQuantity = params.shipping_quantity;
        s.description = params.description;
        sArray.push(s);
    }

    const sl = new StockLog(sArray);
    const inventory = new Inventory(siArray[1], new Date(2020, 1, 1));
    inventory.quantity = 30

    const result = sl.inventoryResult(inventory, new Date(2020, 1, 31))

    expect(result).toBe(54);

});