<template>
  <q-card class="my-card bg-white">
    <q-form class="" @submit.prevent="onSubmit">
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="area_name"
          outlined
          dense
          label="Area Name*"
          placeholder="Area Name*"
          class="col-6"
          :error="v$.area_name.$error"
          :error-message="
            v$.area_name_marathi.$errors.length > 0
              ? v$.area_name.$errors[0].$message
              : ''
          "
          @blur="v$.area_name.$touch()"
        />

        <q-input
          v-model="area_name_marathi"
          outlined
          dense
          label="नाव*"
          placeholder="नाव*"
          class="col-6"
          :error="v$.area_name_marathi.$error"
          :error-message="
            v$.area_name_marathi.$errors.length > 0
              ? v$.area_name_marathi.$errors[0].$message
              : ''
          "
          @blur="v$.area_name_marathi.$touch()"
        />
      </q-card-section>
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-select
          v-model="city_id"
          dense
          options-dense
          outlined
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="stringOptions"
          emit-value
          map-options
          option-value="id"
          option-label="city_name"
          class="col-6"
          :error="v$.city_id.$error"
          error-message="city Name is required"
          @filter="filterFn"
          @blur="v$.city_id.$touch()"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="row justify-end">
        <q-btn label="Submit" type="submit" color="green" class="q-mr-sm" />
        <q-btn
          label="close"
          color="orange"
          @click="$emit('close', { action: false })"
        />
      </q-card-section>
    </q-form>
  </q-card>
</template>
<script>
import useService from "src/hooks/useService";
import useForm from "src/hooks/useForm";
import useCommon from "src/hooks/useCommon";
import {
  reactive,
  toRefs,
  onBeforeMount,
  ref,
  computed,
  defineComponent,
} from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

export default defineComponent({
  name: "AreaCreateUpdate",
  props: {
    currentRow: {
      type: Object,
      default: () => {},
    },
    companyId: {
      type: Number,
    },
  },
  emits: ["close"],
  setup(prop, { emit }) {
    const Area = useService("areas");
    const City = useService("cities");
    const formHandler = useForm();
    const { alert } = useCommon();
    const stringOptions = ref();
    const formOriginal = ref({});
    const lists = reactive({
      areas: [],
      cities: [],
    });

    onBeforeMount(async () => {
      const data = await City.find({
        $paginate: false,
        $select: ["id", "city_name"],
      });

      lists.cities = data.data;
      stringOptions.value = lists.cities;
      if (prop.currentRow !== null) {
        form.id = prop.currentRow.id;
        form.company_id = prop.currentRow.company_id;
        form.area_name = prop.currentRow.area_name;
        form.area_name_marathi = prop.currentRow.area_name_marathi;
        form.city_id = prop.currentRow.city_id;
        formOriginal.value = { ...form };
      }
    });

    const form = reactive({
      id: 0,
      company_id: prop.companyId,
      area_name: null,
      area_name_marathi: null,
      city_id: 0,
    });

    const rules = computed(() => ({
      area_name: {
        required,
        checkNameExist: helpers.withMessage(
          "Area already exists",
          helpers.withAsync(checkNameExist)
        ),
      },
      company_id: {
        required,
      },
      area_name_marathi: {
        required,
      },
      city_id: {
        required,
      },
    }));

    const checkNameExist = async () => {
      if (v$.value) {
        const result = await Area.find({
          area_name: form.area_name,
          "id[$ne]": form.id,
        });
        // result true means $invalid = false
        return result.data.total === 0;
      }
    };

    const v$ = useVuelidate(rules, form, { lazy: true, $scope: true });

    const onSubmit = async () => {
      try {
        v$.value.$touch();
        if (!v$.value.$error) {
          let action = false;
          if (form.id === 0) {
            await Area.insert({ ...form });
            action = true;
          } else {
            const data = formHandler.updatedValue(formOriginal.value, form);
            if (Object.keys(data).length > 0) {
              await Area.update(form.id, data);
              action = true;
            } else {
              alert({
                message: `Nothing to update`,
                type: "positive",
              });
            }
          }
          emit("close", { action });
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    function filterFn(val, update, abort) {
      update(() => {
        try {
          const needle = val.toLowerCase();
          stringOptions.value = lists.cities.filter(
            (v) => v.city_name.toLowerCase().indexOf(needle) > -1
          );
        } catch (error) {
          console.log("error", error);
        }
      });
    }

    return {
      ...toRefs(form),
      onSubmit,
      ...toRefs(lists),
      filterFn,
      stringOptions,
      v$,
      ...prop,
    };
  },
});
</script>
<style lang="scss" scoped></style>
