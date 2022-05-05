<template>
  <div class="brewing-recod">
    <el-row>
      <el-col :span="12">
        <div>brew plan</div>
      </el-col>
      <el-col :span="12">
        <div>
          <FullCalendar :options="calendarOptions" />
        </div>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible">
    <BrewingRecordForm
      :selected_datetime="selected_datetime"
    ></BrewingRecordForm>
    </el-dialog>
    
  </div>
</template>

<script>
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BrewingRecordForm from "@/components/BrewingRecordForm.vue";
import { reactive, ref } from "vue";

export default {
  name: "BrewingRecord",
  components: {
    FullCalendar,
    BrewingRecordForm,
  },
  setup() {
    
    const calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      selectable: true,
      select: function (info) {
        onSelectCalender(info);
      },
    };

    const dialogVisible = ref(false)

    const selected_datetime = reactive({
      from: null,
      to: null,
    });

    function onSelectCalender(selectionInfo) {
      selected_datetime.from = selectionInfo.start
      selected_datetime.to = selectionInfo.end
      dialogVisible.value = true
    }


    return { calendarOptions, selected_datetime, dialogVisible };
  },
};
</script>
