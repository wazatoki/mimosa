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
        :brewEvent="a_brewEvent"
        @submitBrewEvent="onSubmitBrewEvent($event)"
        @clickCancel="onClickBrewingRecordFormCancel"
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
import { BrewEvent } from "@/models/brewEvent";
import { createUUID } from "@/utils/string";
import { reactive, ref } from "vue";

export default {
  name: "BrewingRecord",
  components: {
    FullCalendar,
    BrewingRecordForm,
  },
  setup() {
    const calendarOptions = reactive({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      selectable: true,
      editable: true,
      select: function (info) {
        onSelectCalender(info);
      },
      eventClick: function (info) {
        onClickCalenderEvent(info);
      },
      eventDrop: function (info) {
        onChangeCalendarEvent(info)
      },
      eventResize: function (info) {
        onChangeCalendarEvent(info)
      },
      events: [],
    });

    const dialogVisible = ref(false);
    const brewEvents = [];
    const a_brewEvent = reactive(new BrewEvent());

    function onSelectCalender(info) {
      a_brewEvent.id = createUUID();
      a_brewEvent.name = "";
      a_brewEvent.desc = "";
      a_brewEvent.from = info.start;
      a_brewEvent.to = info.end;
      dialogVisible.value = true;
    }

    function onClickCalenderEvent(info) {
      const brewEvent = brewEvents.find((calenderEvent) => calenderEvent.id === info.event.id);
      if (brewEvent) {
        a_brewEvent.id = brewEvent.id;
        a_brewEvent.name = brewEvent.name;
        a_brewEvent.desc = brewEvent.desc;
        a_brewEvent.from = brewEvent.from;
        a_brewEvent.to = brewEvent.to;
        dialogVisible.value = true;
      }
    }

    function onSubmitBrewEvent(submitedBrewEvent) {
      dialogVisible.value = false;
      // calenderEvent更新処理
      const calenderEvent = {
        id: submitedBrewEvent.id,
        title: submitedBrewEvent.name,
        start: submitedBrewEvent.from,
        end: submitedBrewEvent.to,
      };
      const ceIndex = calendarOptions.events.findIndex(
        (e) => e.id === submitedBrewEvent.id
      );
      if (ceIndex >= 0) {
        calendarOptions.events.splice(ceIndex, 1);
      }
      calendarOptions.events.push(calenderEvent);

      // brewEvent更新処理
      const beIndex = brewEvents.findIndex((e) => e.id === submitedBrewEvent.id);
      if (beIndex >= 0) {
        brewEvents.splice(beIndex, 1);
      }
      brewEvents.push(submitedBrewEvent);
    }

    function onChangeCalendarEvent(info) {
      const be = brewEvents.find(brewEvent => brewEvent.id === info.event.id)
        be.name = info.event.title;
        be.from = info.event.start;
        be.to = info.event.end;

        console.log(brewEvents)
    }

    function onClickBrewingRecordFormCancel() {
      dialogVisible.value = false;
    }

    return {
      calendarOptions,
      a_brewEvent,
      dialogVisible,
      onSubmitBrewEvent,
      onClickCalenderEvent,
      onChangeCalendarEvent,
      onClickBrewingRecordFormCancel,
    };
  },
};
</script>
