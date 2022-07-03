import useService from "./useService";
const END_POINT = "companies";
import { companyColumns as columns } from "src/config/tableColumns";
import { computed } from "vue";
export default () => {
  const { find, findById } = useService(END_POINT);

  const visibleColumns = computed(() => {
    return columns.filter(
      (row) => row.visible === undefined || row.visible === true
    );
  });

  return { find, findById, visibleColumns, columns };
};
