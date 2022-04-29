<template>
  <div class="Stock">
    <el-container>
      <el-header>
        <Header title="入荷" />
      </el-header>
      <el-main>
        <el-form ref="formRef" label-width="120px">
          <el-form-item label="入荷日">
            <el-date-picker
              v-model="actDate"
              type="date"
              placeholder="Pick a day"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="仕入先">
            <el-input
              v-model="recieveFrom"
              class="form-input"
              placeholder="Please input"
            />
          </el-form-item>

          <el-form-item
            v-for="(recievingData, index) in recievingDataArray"
            :key="recievingData.id"
          >
            <stock-recieving-item
              v-model:recieving-data="recievingDataArray[index]"
              :item-msts="itemMsts"
              @deleteItem="removerecievingData(index)"
            ></stock-recieving-item>
          </el-form-item>
          <el-button type="primary" @click="addRecievingData">行追加</el-button>
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

import { ref } from "vue";
import { createUUID } from "@/utils/string"

export default {
  name: "StockRecieving",
  components: {
    Header,
    StockRecievingItem,
  },
  setup(){
    const actDate = ref(new Date());
    const recieveFrom = ref("");
    const recievingDataArray = ref([]);

    const addRecievingData = () => {
      recievingDataArray.value.push({id: createUUID(),item: itemMsts[0], quantity: 0});
    };

    const removerecievingData = (index) => {
      recievingDataArray.value.splice(index, 1);
    };

    const onSubmit = () => {
      console.log(this.recievingItemID);
    };

    const itemMsts= [
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
      ];
      
    return {actDate, recieveFrom, recievingDataArray, itemMsts, addRecievingData, removerecievingData, onSubmit};
  }
 
};
</script>

<style scoped>
.form-input {
  width: 40em;
}
</style>
