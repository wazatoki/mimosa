<template>
<el-form :model="form"></el-form>
</template>

<script>
import { reactive } from "vue";
import { StockUnit } from "@/models/stockUnit"

export default {
    props: {
        stockUnit: {
            type: StockUnit,
        }
    },
    setup(props) {

        const form = reactive({
            id: "",
            name: "",
        });

        return {form}
    }
}
</script>