<template>
  <q-card class="my-card bg-white">
    <q-form class="" @submit.prevent="onSubmit">
      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="volunteer_name"
          outlined
          dense
          label="Volunteer Name*"
          placeholder="Volunteer Name*"
          class="col-6"
          :error="v$.volunteer_name.$error"
          :error-message="
            v$.volunteer_name.$errors.length > 0
              ? v$.volunteer_name.$errors[0].$message
              : ''
          "
          @blur="v$.volunteer_name.$touch()"
        />
        <q-input
          v-model="volunteer_name_marathi"
          outlined
          dense
          label="नाव*"
          placeholder="नाव*"
          class="col-6"
          :error="v$.volunteer_name_marathi.$error"
          :error-message="
            v$.volunteer_name_marathi.$errors.length > 0
              ? v$.volunteer_name_marathi.$errors[0].$message
              : ''
          "
          @blur="v$.volunteer_name_marathi.$touch()"
        />
      </q-card-section>

      <q-card-section class="row justify-between q-col-gutter-xs q-pb-none">
        <q-input
          v-model="designation"
          outlined
          dense
          label="Designation"
          placeholder="Designation"
          class="col-6"
        />

        <q-input
          v-model="contact_no"
          outlined
          dense
          label="Contact No"
          placeholder="Contact No"
          class="col-6"
        />
      </q-card-section>

      <q-card-section
        class="row justify-between q-col-gutter-xs q-pb-none"
        v-if="routName === 'Candidates'"
      >
        <q-input
          v-model="qualification"
          outlined
          dense
          label="Qualification"
          placeholder="Qualification"
          class="col-6"
        />

        <q-input
          v-model="hirarche"
          outlined
          dense
          label="Orders"
          placeholder="Order"
          class="col-6"
        />
      </q-card-section>
      <q-card-section
        class="row justify-between q-col-gutter-xs q-pb-none"
        v-if="routName === 'Candidates'"
      >
        <q-input
          v-model="bio"
          outlined
          dense
          label="Bio"
          placeholder="Bio"
          class="col"
          rows="3"
          type="textarea"
        />
      </q-card-section>
      <q-card-section class="row justify-between">
        <q-input
          v-if="routName === 'Volunteers'"
          v-model="hirarche"
          outlined
          dense
          label="Orders"
          placeholder="Order"
          class="col-6"
        />
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
  name: "VolunteerCreateUpdate",
  props: {
    currentRow: {
      type: Object,
      default: () => {},
    },
    companyId: {
      type: Number,
    },
    routName: {
      type: String,
    },
  },
  emits: ["close"],
  setup(prop, { emit }) {
    //const States = useService("states");
    const Volunteer = useService("volunteers");
    const formHandler = useForm();
    const { alert } = useCommon();
    const formOriginal = ref({});
    const lists = reactive({
      volunteers: [],
    });

    onBeforeMount(async () => {
      if (prop.currentRow !== null) {
        form.id = prop.currentRow.id;
        form.company_id = prop.currentRow.company_id;
        form.volunteer_name = prop.currentRow.volunteer_name;
        form.volunteer_name_marathi = prop.currentRow.volunteer_name_marathi;
        form.designation = prop.currentRow.designation;
        form.contact_no = prop.currentRow.contact_no;
        form.qualification = prop.currentRow.qualification;
        form.bio = prop.currentRow.bio;
        form.hirarche = prop.currentRow.hirarche;
        formOriginal.value = { ...form };
      }
    });

    const form = reactive({
      id: 0,
      company_id: prop.companyId,
      volunteer_name: null,
      volunteer_name_marathi: null,
      volunteer_type:
        prop.routName === "Volunteers" ? "Volunteer" : "Candidate",
      contact_no: null,
      designation: null,
      qualification: null,
      hirarche: 9.0,
      bio: null,
    });

    const rules = computed(() => ({
      volunteer_name: {
        required,
        checkNameExist: helpers.withMessage(
          "Volunteer already exists",
          helpers.withAsync(checkNameExist)
        ),
      },
      company_id: {
        required,
      },
      volunteer_name_marathi: {
        required,
      },
    }));

    const checkNameExist = async () => {
      if (v$.value) {
        const result = await Volunteer.find({
          volunteer_name: form.volunteer_name,
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
            await Volunteer.insert({ ...form });
            action = true;
          } else {
            const data = formHandler.updatedValue(formOriginal.value, form);
            if (Object.keys(data).length > 0) {
              await Volunteer.update(form.id, data);
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
