<template>
  <div class="row justify-center">
    <q-card class="col-4 my-card shadow-8">
      <q-card-section class="">
        <q-img src="https://placeimg.com/200/100/animal" />
        <div class="text-h4 text-primary text-center q-my-lg">
          Change Password
        </div>
      </q-card-section>
      <q-separator />

      <q-form @submit.prevent.stop="onSubmit">
        <q-card-section class="">
          <Input-Password
            v-bind="$attrs"
            outlined
            dense
            placeholder="Old Password"
            @update="(val) => (oldPassword = val)"
          />
          <Input-Password
            v-bind="$attrs"
            outlined
            dense
            @update="(val) => (password = val)"
          />
          <q-input
            v-model="confirmPassword"
            outlined
            dense
            :type="isPassword ? 'password' : 'text'"
            placeholder="Confirm Password"
            :error="v$.confirmPassword.$error"
            error-message="Password mismatch"
            @blur="v$.confirmPassword.$touch()"
          >
            <template #prepend>
              <q-icon name="lock_open" color="primary" />
            </template>
            <template #append>
              <q-icon
                :name="isPassword ? 'visibility_off' : 'visibility'"
                @click="isPassword = !isPassword"
              />
            </template>
          </q-input>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Close"
            color="warning"
            class="float-right"
            @click="goDashboard"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>
<script>
import InputPassword from "src/components/base/InputPassword.vue";
import { reactive, toRefs, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";
import useAuth from "src/hooks/useAuth";
import { useStore } from "vuex";
import useCommon from "src/hooks/useCommon";

export default {
  name: "ChangePassword",
  components: {
    InputPassword,
  },
  setup() {
    const store = useStore();
    const { alert, goto } = useCommon();
    const { updatePassowrd } = useAuth();
    const { id } = store.getters["global/user"];
    const state = reactive({
      oldPassword: true,
      password: null,
      confirmPassword: null,
      isPassword: true,
    });

    const rules = computed(() => ({
      confirmPassword: {
        required,
        sameAsPassword: sameAs(state.password),
      },
    }));

    const v$ = useVuelidate(rules, state, { lazy: true, $scope: true });

    const onSubmit = async () => {
      v$.value.$touch();
      console.log("no error ?", state);
      if (!v$.value.$error) {
        //UpdatePasswordRequest (controller) is compulsary, Need 2 passwords plase check user.class.js patch method
        const dataToSubmit = {
          oldPassword: state.oldPassword,
          password: state.password,
          confirmPassword: state.confirmPassword,
          controller: "updatePasswordRequest",
        };
        try {
          const response = await updatePassowrd(id, dataToSubmit);
          //console.log("response", response);
          if (response.data.id) {
            alert({
              message: `Password update successfully`,
              type: "positive",
            });
            goto({ name: "Dashboard" });
          } else {
            alert({
              message: `Password update Failed`,
              type: "negative",
            });
          }
        } catch (error) {
          alert({
            message: `Old password incorrect`,
            type: "negative",
          });
          console.error("error", error);
        }
      }
    };

    const goDashboard = () => {
      goto({ name: "Dashboard" });
    };

    return {
      onSubmit,
      goDashboard,
      ...toRefs(state),
      v$,
      //  updatePassword,
    };
  },
};
</script>

<style lang="scss" scoped>
.my-card {
  margin: 10px;
}
</style>
