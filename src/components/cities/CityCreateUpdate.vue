<template>
  <q-card class="my-card bg-white">
    <q-form class="" @submit.prevent="onSubmit">
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="city_name"
          outlined
          dense
          label="City Name*"
          placeholder="City Name*"
          class="col-6"
          :error="v$.city_name.$error"
          :error-message="
            v$.city_name_marathi.$errors.length > 0
              ? v$.city_name.$errors[0].$message
              : ''
          "
          @blur="v$.city_name.$touch()"
        />

        <q-input
          v-model="city_name_marathi"
          outlined
          dense
          label="नाव*"
          placeholder="नाव*"
          class="col-6"
          :error="v$.city_name_marathi.$error"
          :error-message="
            v$.city_name_marathi.$errors.length > 0
              ? v$.city_name_marathi.$errors[0].$message
              : ''
          "
          @blur="v$.city_name_marathi.$touch()"
        />
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
  name: "CityCreateUpdate",
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
    const City = useService("cities");
    const formHandler = useForm();
    const { alert } = useCommon();
    const formOriginal = ref({});
    const lists = reactive({
      cities: [],
    });

    onBeforeMount(async () => {
      if (prop.currentRow !== null) {
        form.id = prop.currentRow.id;
        form.company_id = prop.currentRow.company_id;
        form.city_name = prop.currentRow.city_name;
        form.city_name_marathi = prop.currentRow.city_name_marathi;
        formOriginal.value = { ...form };
      }
    });

    const form = reactive({
      id: 0,
      company_id: prop.companyId,
      city_name: null,
      city_name_marathi: null,
    });

    const rules = computed(() => ({
      city_name: {
        required,
        checkNameExist: helpers.withMessage(
          "City already exists",
          helpers.withAsync(checkNameExist)
        ),
      },
      company_id: {
        required,
      },
      city_name_marathi: {
        required,
      },
    }));

    const checkNameExist = async () => {
      if (v$.value) {
        const result = await City.find({
          city_name: form.city_name,
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
            await City.insert({ ...form });
            action = true;
          } else {
            const data = formHandler.updatedValue(formOriginal.value, form);
            if (Object.keys(data).length > 0) {
              await City.update(form.id, data);
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

    return {
      ...toRefs(form),
      onSubmit,
      ...toRefs(lists),
      v$,
      ...prop,
    };
  },
});
</script>
<style lang="scss" scoped></style>
