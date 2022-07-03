<template>
  <q-card class="my-card bg-white">
    <q-form class="" @submit.prevent="onSubmit">
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="company_name"
          outlined
          dense
          placeholder="Company Name*"
          class="col-6"
          :error="v$.company_name.$error"
          :error-message="
            v$.company_name.$errors.length > 0
              ? v$.company_name.$errors[0].$message
              : ''
          "
          @blur="v$.company_name.$touch()"
        />
        <q-input
          v-model="gst_no"
          dense
          outlined
          placeholder="GST No"
          class="col-6"
        />
      </q-card-section>
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-select
          v-model="state_id"
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
          option-label="state_name"
          :error="v$.state_id.$error"
          error-message="State Name is required"
          @filter="filterFn"
          @blur="v$.state_id.$touch()"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-model="is_inventory"
          outlined
          dense
          :options="['Yes', 'No']"
          :options-dense="true"
          placeholder="Inventory"
          class="col-6"
          :error="v$.is_inventory.$error"
          error-message="Inventory is required"
          @blur="v$.is_inventory.$touch()"
        />
      </q-card-section>
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="extraAttr"
          outlined
          dense
          placeholder="Extra Attributes (JSON)"
          type="textarea"
          class="col-12"
          rows="3"
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
  name: "CompanyCreateUpdate",
  props: {
    currentRow: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["close"],
  setup(prop, { emit }) {
    const States = useService("states");
    const Company = useService("companies");
    const formHandler = useForm();
    const { alert } = useCommon();
    const stringOptions = ref();
    const formOriginal = ref({});
    const lists = reactive({
      states: [],
    });

    onBeforeMount(async () => {
      const data = await States.find({
        $paginate: false,
        $select: ["id", "state_name"],
      });
      lists.states = data.data;
      stringOptions.value = lists.states;
      if (prop.currentRow !== null) {
        form.id = prop.currentRow.id;
        form.company_name = prop.currentRow.company_name;
        form.domain = prop.currentRow.domain;
        form.gst_no = prop.currentRow.gst_no;
        form.state_id = prop.currentRow.state_id;
        form.is_inventory = prop.currentRow.is_inventory;
        form.extraAttr = prop.currentRow.extraAttr;
        formOriginal.value = { ...form };
      }
    });

    const form = reactive({
      id: 0,
      company_name: null,
      domain: "support.tss.net.in",
      gst_no: null,
      state_id: 21,
      is_inventory: "No",
      extraAttr: null,
    });

    const rules = computed(() => ({
      company_name: {
        required,
        checkNameExist: helpers.withMessage(
          "Company already exists",
          helpers.withAsync(checkNameExist)
        ),
      },
      state_id: {
        required,
      },
      is_inventory: {
        required,
      },
    }));

    const checkNameExist = async () => {
      if (v$.value) {
        const result = await Company.find({
          company_name: form.company_name,
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
            await Company.insert({ ...form });
            action = true;
          } else {
            const data = formHandler.updatedValue(formOriginal.value, form);
            if (Object.keys(data).length > 0) {
              await Company.update(form.id, data);
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
          stringOptions.value = lists.states.filter(
            (v) => v.state_name.toLowerCase().indexOf(needle) > -1
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
    };
  },
});
</script>
<style lang="scss" scoped></style>
