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
  </div>
</template>

<script>
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  name: "BrewingRecord",
  components: {
    FullCalendar, // make the <FullCalendar> tag available
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

    const onSelectCalender = (selectionInfo) => {
      console.log(selectionInfo);
    };

    return { calendarOptions };
  },
};
</script>
