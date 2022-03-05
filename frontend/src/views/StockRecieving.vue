<template>
  <div class="Stock">
    <el-container>
      <el-header>
        <Header title="入荷"></Header>
      </el-header>
      <el-main>
        <el-form ref="formRef" :model="form" label-width="120px">
          <el-form-item label="入荷日">
            <el-date-picker
              v-model="form.actDate"
              type="date"
              placeholder="Pick a day"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="仕入先">
            <el-input
              v-model="form.recieveFrom"
              class="form-input"
              placeholder="Please input"
            />
          </el-form-item>

          <el-form-item
            v-for="(recievingData, index) in form.recievingDataArray"
            :key="index"
          >
            <stock-recieving-item
              v-model:recievingData="form.recievingDataArray[index]"
              :itemMsts="itemMsts"
            ></stock-recieving-item>
          </el-form-item>
          <el-button type="primary" @click="onSubmit">Create</el-button>
          <el-button>Cancel</el-button>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import StockRecievingItem from "@/components/StockRecievingItem.vue";
import { Item } from "@/models/recieve";
import { reactive } from "vue";

export default {
  name: "StockRecieving",
  components: {
    Header,
    StockRecievingItem,
  },
  data() {
    return {
      form: reactive({
        actDate: new Date(),
        recieveFrom: "",
        recievingDataArray: [
          {
            item: {
              id: "item-1",
              name: "item-1-name",
              receivingUnit: {
                id: "unit-1",
                name: "g",
                conversionFactor: 1,
              },
              shippingUnit: {
                id: "unit-2",
                name: "Kg",
                conversionFactor: 1000,
              },
              stockUnit: {
                id: "unit-1",
                name: "g",
                conversionFactor: 1,
              },
              baseUnit: {
                id: "unit-1",
                name: "g",
                conversionFactor: 1,
              },
            },
            quantity: 2,
          },
          {
            item: {
              id: "item-1",
              name: "item-1-name",
              receivingUnit: {
                id: "unit-1",
                name: "g",
                conversionFactor: 1,
              },
              shippingUnit: {
                id: "unit-2",
                name: "Kg",
                conversionFactor: 1000,
              },
              stockUnit: {
                id: "unit-1",
                name: "g",
                conversionFactor: 1,
              },
              baseUnit: {
                id: "unit-1",
                name: "g",
                conversionFactor: 1,
              },
            },
            quantity: 3,
          },
        ],
      }),
      itemMsts: [
        {
          id: "item-1",
          name: "item-1-name",
          receivingUnit: {
            id: "unit-1",
            name: "g",
            conversionFactor: 1,
          },
          shippingUnit: {
            id: "unit-2",
            name: "Kg",
            conversionFactor: 1000,
          },
          stockUnit: {
            id: "unit-1",
            name: "g",
            conversionFactor: 1,
          },
          baseUnit: {
            id: "unit-1",
            name: "g",
            conversionFactor: 1,
          },
        },
        {
          id: "item-2",
          name: "item-2-name",
          receivingUnit: {
            id: "unit-1",
            name: "Kg",
            conversionFactor: 1,
          },
          shippingUnit: {
            id: "unit-2",
            name: "Kg",
            conversionFactor: 1000,
          },
          stockUnit: {
            id: "unit-1",
            name: "g",
            conversionFactor: 1,
          },
          baseUnit: {
            id: "unit-1",
            name: "g",
            conversionFactor: 1,
          },
        },
      ],
    };
  },
  methods: {
    addRecievingItem() {
      //const imst = new ItemMST()
      const item = new Item("", item, 0);

      this.recievingItems.push();
    },
    onSubmit() {
      console.log(this.recievingItemID);
    },
  },
};
</script>

<style scoped>
.form-input {
  width: 40em;
}
</style>
