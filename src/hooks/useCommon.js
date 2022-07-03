import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default () => {
  const router = useRouter();
  const $q = useQuasar();
  const alert = (argument) => {
    $q.notify(argument);
  };
  const goto = (argument) => {
    router.push(argument);
  };

  return { alert, goto };
};
