import { ref, computed } from "vue";
export default {
  setup() {
    const no = ref(1);
    const c1 = computed(() => {
      return 100;
    });
    return { no, c1 };
  },
};
