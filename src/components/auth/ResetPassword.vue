<template>
  <div class="q-pa-md row justify-center">
    <q-card class="col-4 my-card shadow-8">
      <q-card-section class="">
        <div class="text-h4 text-primary text-center q-my-lg">
          Reset Password
        </div>
      </q-card-section>
      <q-separator />
      <q-form @submit.prevent.stop="onSubmit">
        <q-card-section>
          <q-input
            v-model="password"
            :type="isPassword ? 'password' : 'text'"
            outlined
            dense
            placeholder="Password"
            autocomplete="false"
            class="q-my-sm"
            :error="v$.password.$error"
            :error-message="
              v$.password.$errors.length > 0
                ? v$.password.$errors[0].$message
                : ''
            "
            @blur="v$.password.$touch()"
          >
            <template #prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template #append>
              <q-icon
                :name="isPassword ? 'visibility_off' : 'visibility'"
                @click="isPassword = !isPassword"
              />
            </template>
          </q-input>
          <q-input
            v-model="confirmPassword"
            :type="isConfirmPassword ? 'password' : 'text'"
            outlined
            dense
            placeholder="Confirm Password"
            autocomplete="false"
            class="q-my-md"
            :error="v$.confirmPassword.$error"
            error-message="Password & Confirm Password mismatch"
            @blur="v$.confirmPassword.$touch()"
          >
            <template #prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template #append>
              <q-icon
                :name="isConfirmPassword ? 'visibility_off' : 'visibility'"
                @click="isConfirmPassword = !isConfirmPassword"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions class="justify-center q-mb-md">
          <q-btn
            no-caps
            label="Update"
            type="submit"
            color="primary"
            :disabled="v$.$invalid"
            class="col-6"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
  <Modal
    :show="show"
    v-bind="$attrs"
    icon="help_outline"
    title="Error"
    @close="closeModal"
  >
    <q-card-section horizontal>
      <q-card-section>
        <q-icon name="warning" class="text-red" style="font-size: 4rem" />
      </q-card-section>
      <q-card-section class="justify-center">
        <div>
          Your Token is expaired or invalid please try generate a new request.
        </div>
        <div>
          <q-btn
            dense
            color="green"
            label="Close"
            class="float-right"
            @click="closeModal"
          />
        </div>
      </q-card-section>
    </q-card-section>
  </Modal>
</template>
<script>
import { reactive, toRefs, computed, onMounted, onBeforeMount } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import useCommon from "src/hooks/useCommon";
import useAuth from "src/hooks/useAuth";
import Modal from "src/components/base/Modal.vue";
//http://localhost:8080/reset-password?forgotcode=658b2677d5
export default {
  components: {
    Modal,
  },
  setup() {
    const route = useRoute();
    const forgotCode = route.query.forgotcode;
    const { alert, goto } = useCommon();
    const { resetPassowrdCodeValidity, resetPassowrd } = useAuth();
    onBeforeMount(async () => {
      try {
        const response = await resetPassowrdCodeValidity(forgotCode);
        console.log(response);
        state.user_id = response.data.user_id;
      } catch (error) {
        state.show = true;
      }
    });

    const state = reactive({
      password: null,
      confirmPassword: null,
      isPassword: true,
      isConfirmPassword: true,
      show: false,
      user_id: 0,
    });

    const rules = computed(() => ({
      password: {
        required,
        valid: helpers.withMessage(
          "Alpha numeric, altelst 1 Uppercase, lowercase & special char",
          function (value) {
            const containsUppercase = /[A-Z]/.test(value);
            const containsLowercase = /[a-z]/.test(value);
            const containsNumber = /[0-9]/.test(value);
            const containsSpecial = /[#?!@$%^&*-]/.test(value);
            return (
              containsUppercase &&
              containsLowercase &&
              containsNumber &&
              containsSpecial
            );
          }
        ),
      },
      confirmPassword: { required, sameAsPassword: sameAs(state.password) },
    }));
    const v$ = useVuelidate(rules, state, { lazy: true });

    const onSubmit = async () => {
      v$.value.$touch();
      if (!v$.value.$error) {
        let request = {
          resetToken: forgotCode,
          newPassword: state.password,
        };
        let response = await resetPassowrd(state.user_id, request);
        console.log("reques", request, response);

        if (response) {
          alert({
            message: `Password reset successfully`,
            type: "positive",
          });
          route.push({ name: "Authentication" });
        } else {
          alert({
            message: `Email or Password is wrong`,
            type: "negative",
          });
        }
      }
    };
    const closeModal = () => {
      state.show = false;
      goto({ name: "Home" });
    };
    return {
      ...toRefs(state),
      v$,
      onSubmit,
      closeModal,
    };
  },
};
</script>
