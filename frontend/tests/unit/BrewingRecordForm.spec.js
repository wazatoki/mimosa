import { shallowMount } from "@vue/test-utils";
import BrewingRecordForm from "@/components/BrewingRecordForm.vue";
import { BrewEvent } from "@/models/brewEvent";
import ElementPlus from "element-plus";

describe("BrewingRecordForm.vue", () => {
  it("BrewingRecordForm view", () => {
    const brewEvent = new BrewEvent();

    const wrapper = shallowMount(BrewingRecordForm, {
      global: {
        plugins: [ElementPlus],
      },
      props: { brewEvent,  },
    });
  });
});
