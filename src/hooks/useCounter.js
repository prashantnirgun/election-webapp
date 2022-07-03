//useCounter.js
import { ref, readonly, computed } from "vue";
//state value accross app
const count = ref(0);
export default function useCounter() {
  const value = ref(0);
  const increment = () => count.value++;
  const next = computed(() => count.value + 1);
  return {
    count: readonly(count),
    increment,
    next,
  };
}
