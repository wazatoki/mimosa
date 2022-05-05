import { shallowMount } from "@vue/test-utils";
import BrewingRecordForm from "@/components/BrewingRecordForm.vue";
import ElementPlus from "element-plus";

describe("BrewingRecordForm.vue", () => {
  it("BrewingRecordForm view", () => {
    const dialogFormVisible = true;

    const wrapper = shallowMount(BrewingRecordForm, {
      global: {
        plugins: [ElementPlus],
      },
      props: { dialogFormVisible },
    });
  });
});
