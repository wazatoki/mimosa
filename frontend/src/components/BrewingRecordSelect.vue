<template>
    <el-row>
    <el-col :span="6">
    <el-button type="primary" @click="onClickCreate">新規</el-button>
    </el-col>
    <el-col :span="18"></el-col>
  </el-row>
</template>

<script>
import { createBrewPlan } from '../services/BrewingPlanServices'

export default {
    name: "BrewingRecordSelect",
    props: [],
    emits: [],
    setup(props, { emit }) {

        const onClickCreate = async function(){
            await createBrewPlan().then(data => {
                emit('fetchedNewPlanID', data.id)
            });
        }

        return {onClickCreate}
    }
}
</script>
