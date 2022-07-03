<template>
  <q-card class="my-card bg-white">
    <q-form class="" @submit.prevent="onSubmit">
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="voter_name"
          outlined
          dense
          label="Voter Name*"
          placeholder="Voter Name*"
          class="col-6"
          :error="v$.voter_name.$error"
          :error-message="
            v$.voter_name.$errors.length > 0
              ? v$.voter_name.$errors[0].$message
              : ''
          "
          @blur="v$.voter_name.$touch()"
        />

        <q-input
          v-model="voter_name_marathi"
          outlined
          dense
          label="नाव*"
          placeholder="नाव*"
          class="col-6"
          :error="v$.voter_name_marathi.$error"
          :error-message="
            v$.voter_name_marathi.$errors.length > 0
              ? v$.voter_name_marathi.$errors[0].$message
              : ''
          "
          @blur="v$.voter_name_marathi.$touch()"
        />
      </q-card-section>

      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="mobile"
          outlined
          dense
          label="Mobile"
          placeholder="Mobile"
          class="col-6"
        />

        <q-input
          v-model="email"
          outlined
          dense
          label="Email"
          placeholder="Email"
          class="col-6"
        />
      </q-card-section>

      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="reference_no"
          outlined
          dense
          label="Account No"
          placeholder="Account No"
          class="col-6"
        />

        <q-input
          v-model="dob"
          mask="date"
          :rules="['date']"
          outlined
          dense
          class="col-6"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="dob">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-select
          v-model="gender"
          outlined
          dense
          :options="['Male', 'Female']"
          :options-dense="true"
          placeholder="Gender"
          label="Gender"
          class="col-6"
          :error="v$.gender.$error"
          error-message="Gender is required"
          @blur="v$.gender.$touch()"
        />

        <q-select
          v-model="area_id"
          dense
          options-dense
          outlined
          use-input
          hide-selected
          fill-input
          label="Area*"
          placeholder="Area*"
          input-debounce="0"
          :options="stringOptions"
          emit-value
          map-options
          option-value="id"
          option-label="area_name"
          class="col-6"
          :error="v$.area_id.$error"
          error-message="Area Name is required"
          @filter="filterFn"
          @blur="v$.area_id.$touch()"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-select
          v-model="last_voting"
          outlined
          dense
          :options="['Yes', 'No']"
          :options-dense="true"
          placeholder="Gender"
          label="Gender"
          class="col-6"
        />

        <q-select
          v-model="category"
          outlined
          dense
          :options="['Yes', 'No', 'Not Sure']"
          :options-dense="true"
          placeholder="Category"
          label="Category"
          class="col-6"
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
  name: "VoterCreateUpdate",
  props: {
    currentRow: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["close"],
  setup(prop, { emit }) {
    //const States = useService("states");
    const Voter = useService("voters");
    const Areas = useService("areas");
    const formHandler = useForm();
    const { alert } = useCommon();
    const stringOptions = ref();
    const formOriginal = ref({});
    const lists = reactive({
      areas: [],
      cities: [],
    });

    onBeforeMount(async () => {
      const data = await Areas.find({
        $paginate: false,
        $select: ["id", "area_name"],
      });

      lists.areas = data.data;
      stringOptions.value = lists.areas;
      if (prop.currentRow !== null) {
        form.id = prop.currentRow.id;
        form.company_id = prop.currentRow.company_id;
        form.voter_name = prop.currentRow.voter_name;
        form.voter_name_marathi = prop.currentRow.voter_name_marathi;
        form.mobile = prop.currentRow.mobile;
        form.email = prop.currentRow.email;
        form.reference_no = prop.currentRow.reference_no;
        form.dob = prop.currentRow.dob;
        form.age = prop.currentRow.age;
        form.gender = prop.currentRow.gender;
        form.last_voting = prop.currentRow.last_voting;
        form.category = prop.currentRow.category;
        form.volunteer_id = prop.currentRow.volunteer_id;
        form.apartment = prop.currentRow.apartment;
        form.street = prop.currentRow.street;
        form.pincode = prop.currentRow.pincode;
        form.landmark = prop.currentRow.landmark;
        form.city_id = prop.currentRow.city_id;
        form.area_id = prop.currentRow.area_id;
        formOriginal.value = { ...form };
      }
    });

    const form = reactive({
      id: 0,
      company_id: 0,
      voter_name: null,
      voter_name_marathi: null,
      mobile: "",
      email: "",
      reference_no: "",
      dob: null,
      age: null,
      gender: "Male",
      last_voting: "No",
      category: "No",
    });

    const rules = computed(() => ({
      category_name: {
        required,
        checkNameExist: helpers.withMessage(
          "Voter already exists",
          helpers.withAsync(checkNameExist)
        ),
      },
      company_id: {
        required,
      },
      voter_name: {
        required,
      },
      voter_name_marathi: {
        required,
      },
      volunteer_id: {
        required,
      },
      area_id: {
        required,
      },
      gender: {
        required,
      },
    }));

    const checkNameExist = async () => {
      if (v$.value) {
        const result = await Voter.find({
          voter_name: form.voter_name,
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
            await Voter.insert({ ...form });
            action = true;
          } else {
            const data = formHandler.updatedValue(formOriginal.value, form);
            if (Object.keys(data).length > 0) {
              await Voter.update(form.id, data);
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
          stringOptions.value = lists.areas.filter(
            (v) => v.area_name.toLowerCase().indexOf(needle) > -1
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
