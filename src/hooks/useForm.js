import { ref } from "vue";
export default () => {
  const updatedValue = (primary, current) => {
    const keys = Object.keys(primary);
    const data = {};
    keys.map((key) => {
      if (primary[key] !== current[key]) {
        console.log("key", key);
        data[key] = current[key];
      }
    });

    return data;
  };

  const deletedList = (lists, key) => {
    let names = "";
    if (lists.length > 0) {
      lists.map((row) => {
        names += (names.length > 0 ? ", " : "") + row[key];
      });
    }
    return names;
  };

  const sortBuilder = (lists) => {
    let sortedList = [];
    let tempList = lists.filter((row) => row.sort && row.sort.index >= 0);

    tempList.sort((a, b) => a.sort.index - b.sort.index);

    tempList.map((row) => {
      if (row.sort && row.sort?.index >= 0) {
        const key = `$sort[${row.name}]`;
        const data = {
          [key]: row.sort.order ? 1 : 0,
        };
        sortedList.push(data);
      }
    });
    return sortedList;
  };

  const whereBuilder = async (lists) => {
    let expression = {};
    const columns = [];
    lists.map((row) => {
      if (row.condition !== null && row.values.length) {
        let key;
        switch (row.condition) {
          case "Equal":
            //expression = `${props.row.name}=${model.value}`;
            key = row.type === "Number" ? `${row.name}[$in][]` : `${row.name}`;
            expression = { [key]: row.values[0] };
            break;
          case "Not Equal":
            //expression = `${modelOne.value}[$ne]=${props.row.name}`;
            key = `${row.name}[$ne]`;
            expression = { [key]: row.values[0] };
            break;
          case "Starting with":
            //expression = `${modelOne.value}[$like]=%${props.row.name}`;
            key = `${row.name}[$like]`;
            expression = { [key]: `${row.values[0]}%` };
            break;
          case "Contains":
            //expression = `${modelOne.value}[$like]=%${props.row.name}%`;
            key = `${row.name}[$like]`;
            expression = { [key]: `%${row.values[0]}%` };
            break;
          case "Greater than":
            //expression = `${modelOne.value}[$gt]=${props.row.name}`;
            key = `${row.name}[$gt]`;
            expression = { [key]: row.values[0] };
            break;
          case "Greater than equal":
            //expression = `${modelOne.value}[$gte]=${props.row.name}`;
            key = `${row.name}[$gte]`;
            expression = { [key]: row.values[0] };
            break;
          case "Less than":
            key = `${row.name}[$lt]`;
            expression = { [key]: row.values[0] };
            break;
          case "Less than equal":
            //expression = `${modelOne.value}[$lte]=${props.row.name}`;
            key = `${row.name}[$lte]`;
            expression = { [key]: row.values[0] };
          case "Between":
            //expression = `${modelOne.value}[$gte]=${props.row.name}&${modelOne.value}[$lte]=${props.row.name}`;
            key = `${row.name}[$gte]`;
            expression = { [key]: row.values[0] };
            break;
          default:
            error.value = "Please select the condition";
            break;
        }
        columns.push(expression);
      }
    });
    return columns;
  };

  const booleanConditon = ref(["Select Condition", "Equal", "Not Equal"]);
  const stringConditon = ref([
    "Select Condition",
    "Equal",
    "Not Equal",
    "Contains",
    "Starting with",
  ]);
  const numberConditon = ref([
    "Select Condition",
    "Equal",
    "Greater than",
    "Greater than equal",
    "Less than",
    "Less than equal",
  ]);
  const dateConditon = ref([
    "Select Condition",
    "Between",
    "Greater than",
    "Less than",
  ]);
  return {
    updatedValue,
    deletedList,
    booleanConditon,
    stringConditon,
    numberConditon,
    dateConditon,
    sortBuilder,
    whereBuilder,
  };
};
