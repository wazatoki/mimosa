<template>
  <div class="stock-recieving-item">
    <el-row>
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
      <el-col :span="10"
        ><el-input @blur="emitData" v-model="quantity" class="form-input" placeholder="数量" />
      </el-col>
      <el-col :span="2">{{ unitName }}</el-col>
    </el-row>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
    props: ['recievingData', 'itemMsts'],
    emits: ['update:recievingData'],
  setup(props, { emit }) {
    const quantity = ref(props.recievingData.quantity);
    const unitName = ref(props.recievingData.item.receivingUnit.name);
    const selectedItemID = ref(props.recievingData.item.id);
    const onChange = () => {
      unitName.value = props.itemMsts.find(
        (item) => item.id === selectedItemID.value
      ).receivingUnit.name;
      emitData();
    };
    const emitData = () => {
      emit('update:recievingData', {
        item: props.itemMsts.find((item) => item.id === selectedItemID.value),
        quantity: quantity.value
      });
    };

    return { selectedItemID, unitName, quantity, onChange, emitData };
  },
};
</script>