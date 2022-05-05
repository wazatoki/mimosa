<template>
  <el-row class="brewing-record-item">
    <el-col :span="12"
      ><el-select
        @change="onChange"
        v-model="selectedItemID"
        class="form-input"
        placeholder="品名"
      >
        <el-option
          v-for="item in itemMsts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="8"
      ><el-input
        @blur="emitData"
        v-model="quantity"
        class="form-input"
        placeholder="数量"
      />
    </el-col>
    <el-col :span="2">{{ unitName }}</el-col>
    <el-col :span="2">
      <el-button type="warning" @click="clickDelete">行削除</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { ref } from "vue";

export default {
  name: "BrewingRecordItem",
  props: ["brewingItemData", "itemMsts"],
  emits: ["update:brewingItemData", "deleteItem"],
  setup(props, { emit }) {

    const quantity = ref(props.brewingItemData.quantity);
    const unitName = ref(props.brewingItemData.item.brewingUnit.name);
    const selectedItemID = ref(props.brewingItemData.item.id);

    const onChange = () => {
      unitName.value = props.itemMsts.find(
        (item) => item.id === selectedItemID.value
      ).brewingUnit.name;
      emitData();
    };
    const emitData = () => {
      emit("update:brewingItemData", {
        id: props.brewingItemData.id,
        item: props.itemMsts.find((item) => item.id === selectedItemID.value),
        quantity: quantity.value,
      });
    };
    const clickDelete = () => {
      emit("deleteItem");
    };

    return {
      selectedItemID,
      unitName,
      quantity,
      onChange,
      emitData,
      clickDelete,
    };
  },
};
</script>
