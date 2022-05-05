<template>
  <el-form :model="form">
    <el-row>
      <el-col :span="24">
        <el-form-item label="event title" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="from" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.from"
            type="datetime"
            placeholder="Select date and time"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="to" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.to"
            type="datetime"
            placeholder="Select date and time"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="addIngredient">追加</el-button>
      </el-col>
    </el-row>
    <BrewingRecordItem
      v-for="(ingredient, index) in form.ingredients"
      :key="ingredient.id"
      :brewingItemData="form.ingredients[index]"
      :item-msts="itemMsts"
      @update:brewingItemData="updateBrewingItemData($event, index)"
      @deleteItem="removeBrewingItemData(index)"
    ></BrewingRecordItem>

    <el-button type="primary" @click="onSubmit">Create</el-button>
    <el-button>Cancel</el-button>
  </el-form>
</template>

<script>
import { reactive, watch } from "vue";
import { createUUID } from "@/utils/string";
import BrewingRecordItem from "@/components/BrewingRecordItem.vue";

export default {
  name: "BrewingRecordForm",
  components: {
    BrewingRecordItem,
  },
  props: {
    selected_datetime: {
      type: Object,
    },
  },

  setup(props) {
    const form = reactive({
      name: "",
      from: props.selected_datetime.from,
      to: props.selected_datetime.to,
      ingredients: [],
    });
    const formLabelWidth = "140px";

    watch(props.selected_datetime, (n) => {
      form.from = n.from;
      form.to = n.to;
    });

    const addIngredient = () => {
      form.ingredients.push({ id: createUUID(), item: itemMsts[0], quantity: 0 });
    };

    const updateBrewingItemData = (brewingItemData, index) => {
        form.ingredients[index]=brewingItemData
    };

    const removeBrewingItemData = (index) => {
      form.ingredients.splice(index, 1);
    };

    const onSubmit = () => {
      console.log(form);
    };

    const itemMsts = [
      {
        id: "item-1",
        name: "item-1-name",
        brewingUnit: {
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
        brewingUnit: {
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

    return {
      form,
      formLabelWidth,
      addIngredient,
      updateBrewingItemData,
      removeBrewingItemData,
      onSubmit,
      itemMsts,
    };
  },
};
</script>
