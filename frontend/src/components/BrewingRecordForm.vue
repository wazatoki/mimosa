<template>
  <el-form :model="form">
    <el-row>
      <el-col :span="24">
        <el-form-item label="batch numbre" :label-width="formLabelWidth">
          <el-input v-model="form.brewPlan.batchNumber" autocomplete="off" disabled/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="batch name" :label-width="formLabelWidth">
          <el-input v-model="form.brewPlan.batchName" autocomplete="off" disabled/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="event title" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="event description" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.desc" autocomplete="off" />
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
    <el-row>
      <el-col>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-popconfirm
          confirm-button-text="Yes"
          cancel-button-text="No"
          title="Are you sure to delete this?"
          @confirm="onDelete"
        >
          <template #reference>
            <el-button type="danger">Delete</el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { reactive, watch } from "vue";
import { createUUID } from "@/utils/string";
import BrewingRecordItem from "@/components/BrewingRecordItem.vue";
import { BrewEvent } from "@/models/brewEvent";

export default {
  name: "BrewingRecordForm",
  components: {
    BrewingRecordItem,
  },
  props: {
    brewEvent: {
      type: BrewEvent,
    },
    itemMstss: {
      type: Array,
    },
  },
  emits: ["submitBrewEvent", "clickCancel", "clickDelete"],

  setup(props, { emit }) {
    const form = reactive(
      new BrewEvent(
        props.brewEvent.id,
        props.brewEvent.name,
        props.brewEvent.desc,
        props.brewEvent.from,
        props.brewEvent.to,
        props.brewEvent.ingredients,
        props.brewEvent.brewPlan
      )
    );
    const formLabelWidth = "140px";

    watch(props.brewEvent, (n) => {
      form.id = n.id;
      form.name = n.name;
      form.desc = n.desc;
      form.from = n.from;
      form.to = n.to;
      form.ingredients = n.ingredients;
      form.brewPlan = n.brewPlan;
    });

    const addIngredient = () => {
      form.ingredients.push({ id: createUUID(), item: itemMsts[0], quantity: 0 });
    };

    const updateBrewingItemData = (brewingItemData, index) => {
      form.ingredients[index] = brewingItemData;
    };

    const removeBrewingItemData = (index) => {
      form.ingredients.splice(index, 1);
    };

    const onSubmit = () => {
      emit(
        "submitBrewEvent",
        new BrewEvent(
          form.id,
          form.name,
          form.desc,
          form.from,
          form.to,
          form.ingredients,
          form.brewPlan
        )
      );
    };

    const onCancel = () => {
      emit("clickCancel");
    };

    const onDelete = () => {
      emit("clickDelete", form.id);
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
      onCancel,
      onDelete,
      itemMsts,
    };
  },
};
</script>
