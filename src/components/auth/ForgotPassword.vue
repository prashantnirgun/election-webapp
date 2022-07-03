<template>
  <div class="row q-mt-lg">
    <div class="col-6 q-px-lg">
      <q-img
        class=""
        src="images\forgot-password.svg"
        spinner-color="primary"
        spinner-size="82px"
      />
    </div>
    <div class="col-4 q-px-lg">
      <div class="text-h3 q-mb-lg">Forgot Password</div>
      <p>
        Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur
        adipisicing.
      </p>
      <q-form @submit.prevent.stop="onSubmit">
        <q-input
          v-model="email"
          outlined
          dense
          placeholder="Email"
          :error="v$.email.$error"
          error-message="Invalid email"
          class="q-mb-md"
          @blur="v$.email.$touch()"
        >
          <template #prepend>
            <q-icon name="mail" color="primary" />
          </template>
          <template #append>
            <q-icon name="close" class="cursor-pointer" @click="email = ''" />
          </template>
        </q-input>
        <div class="q-my-lg">
          <q-btn
            no-caps
            label="Reset Password"
            type="submit"
            color="primary"
            :disabled="v$.$invalid"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import useCommon from "src/hooks/useCommon";
import useAuth from "src/hooks/useAuth";

export default {
  name: "ForgotPassword",
  setup() {
    const { forgotPasswordRequst } = useAuth();
    const { alert, goto } = useCommon();

    const state = reactive({
      email: null,
    });

    const rules = computed(() => ({
      email: {
        required,
        email,
      },
    }));
    const v$ = useVuelidate(rules, state, { lazy: true });

    const onSubmit = async () => {
      v$.value.$touch();
      if (!v$.value.$error) {
        const user = await forgotPasswordRequst(state.email);
        if (user) {
          alert({
            message: `Reset password instruction send on ${state.email}`,
            type: "positive",
          });
          goto({ name: "Home" });
        } else {
          alert({
            message: `Email or Password is wrong`,
            type: "negative",
          });
        }
      }
    };

    return {
      onSubmit,
      ...toRefs(state),
      v$,
    };
  },
};
</script>
