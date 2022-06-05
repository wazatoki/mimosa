<template>
  <div>
    <el-row>
      <el-col :span="24">
        <p>単位マスタ</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-button>新規作成</el-button>
      </el-col>
      <el-col :span="18">
        <el-table :data="items" style="width: 100%">
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column label="actions"
            ><el-button>編集</el-button
            ><el-button type="warning">削除</el-button></el-table-column
          >
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  setup() {
    const items = reactive([
      { id: 1, name: "g" },
      { id: 2, name: "Kg" },
      { id: 3, name: "dl" },
      { id: 4, name: "L" },
    ]);

    return { items };
  },
};
</script>
