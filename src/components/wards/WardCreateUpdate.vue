<template>
  <q-card class="my-card bg-white">
    <q-form class="" @submit.prevent="onSubmit">
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="ward_name"
          outlined
          dense
          label="Ward Name*"
          placeholder="Ward Name*"
          class="col-6"
          :error="v$.ward_name.$error"
          :error-message="
            v$.ward_name_marathi.$errors.length > 0
              ? v$.ward_name.$errors[0].$message
              : ''
          "
          @blur="v$.ward_name.$touch()"
        />

        <q-input
          v-model="ward_name_marathi"
          outlined
          dense
          label="नाव*"
          placeholder="नाव*"
          class="col-6"
          :error="v$.ward_name_marathi.$error"
          :error-message="
            v$.ward_name_marathi.$errors.length > 0
              ? v$.ward_name_marathi.$errors[0].$message
              : ''
          "
          @blur="v$.ward_name_marathi.$touch()"
        />
      </q-card-section>
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="ward_no"
          outlined
          dense
          label="Ward No*"
          placeholder="Ward No*"
          class="col-6"
          :error="v$.ward_no.$error"
          :error-message="
            v$.ward_no.$errors.length > 0 ? v$.ward_no.$errors[0].$message : ''
          "
          @blur="v$.ward_no.$touch()"
        />

        <q-select
          v-model="booth_manager_id"
          dense
          options-dense
          outlined
          use-input
          hide-selected
          label="Booth Manager*"
          placeholder="Booth Manager*"
          fill-input
          input-debounce="0"
          :options="stringOptions"
          emit-value
          map-options
          option-value="id"
          option-label="volunteer_name"
          class="col-6"
          :error="v$.booth_manager_id.$error"
          error-message="Name is required"
          @filter="filterFn"
          @blur="v$.booth_manager_id.$touch()"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="address"
          outlined
          dense
          label="Address"
          placeholder="Address"
          class="col"
          rows="3"
          type="textarea"
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
  name: "WardCreateUpdate",
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
    const Ward = useService("wards");
    const Volunteer = useService("volunteers");
    const formHandler = useForm();
    const { alert } = useCommon();
    const stringOptions = ref();
    const formOriginal = ref({});
    const lists = reactive({
      volunteers: [],
    });

    onBeforeMount(async () => {
      const data = await Volunteer.find({
        $paginate: false,
        $select: ["id", "volunteer_name"],
        volunteer_type: "Volunteer",
        company_id: prop.companyId,
      });

      lists.volunteers = data.data;
      stringOptions.value = lists.volunteers;
      if (prop.currentRow !== null) {
        form.id = prop.currentRow.id;
        form.company_id = prop.currentRow.company_id;
        form.ward_name = prop.currentRow.ward_name;
        form.ward_name_marathi = prop.currentRow.ward_name_marathi;
        form.ward_no = prop.currentRow.ward_no;
        form.booth_manager_id = prop.currentRow.booth_manager_id;
        form.address = prop.currentRow.address;
        formOriginal.value = { ...form };
      }
    });

    const form = reactive({
      id: 0,
      company_id: prop.companyId,
      ward_name: null,
      ward_name_marathi: null,
      ward_no: null,
      booth_manager_id: 0,
      address: null,
    });

    const rules = computed(() => ({
      company_id: {
        required,
      },
      ward_no: {
        required,
      },
      ward_name: {
        required,
        checkNameExist: helpers.withMessage(
          "Ward already exists",
          helpers.withAsync(checkNameExist)
        ),
      },
      ward_name_marathi: {
        required,
      },
      booth_manager_id: {
        required,
      },
    }));

    const checkNameExist = async () => {
      if (v$.value) {
        const result = await Ward.find({
          ward_name: form.ward_name,
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
            await Ward.insert({ ...form });
            action = true;
          } else {
            const data = formHandler.updatedValue(formOriginal.value, form);
            if (Object.keys(data).length > 0) {
              await Ward.update(form.id, data);
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
          stringOptions.value = lists.volunteers.filter(
            (v) => v.volunteer_name.toLowerCase().indexOf(needle) > -1
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
