<template>
  <q-form @submit.prevent.stop="onSubmit">
    <q-input
      v-model="email"
      outlined
      dense
      placeholder="Username"
      class="q-mb-md"
      :error="v$.email.$error"
      error-message="Invalid email"
      @blur="v$.email.$touch()"
    >
      <template #prepend>
        <q-icon name="person" color="primary" />
      </template>
      <template #append>
        <q-icon name="close" class="cursor-pointer" @click="email = ''" />
      </template>
    </q-input>
    <Input-Password
      v-bind="$attrs"
      class="q-my-md"
      outlined
      dense
      @update="(val) => (password = val)"
    />

    <div class="row justify-between">
      <q-checkbox
        v-model="rememberMe"
        class="text-grey-8 q-my-md"
        dense
        label="Remember me"
        color="primary"
      ></q-checkbox>

      <q-btn
        flat
        no-caps
        :ripple="false"
        class="text-weight-regular text-blue"
        label="Forgot Password"
        @click="$emit('toggleSlide', 'forgot')"
      />
    </div>
    <div>
      <q-btn
        label="Login."
        class="full-width"
        type="submit"
        color="primary"
        :disabled="v$.$invalid"
      />
    </div>
    <div style="height: 20px"></div>
  </q-form>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import useCommon from "src/hooks/useCommon";
import useAuth from "src/hooks/useAuth";
import InputPassword from "src/components/base/InputPassword.vue";

export default {
  name: "SignIn",
  components: {
    InputPassword,
  },
  emits: ["toggleSlide"],
  setup(props, { emit }) {
    const { loginRequest } = useAuth();
    const { alert, goto } = useCommon();

    const state = reactive({
      email: null,
      password: null,
      rememberMe: false,
      isPassword: true,
    });

    const rules = computed(() => ({
      email: {
        required,
        email,
      },
    }));
    const v$ = useVuelidate(rules, state, { lazy: true, $scope: true });

    const onSubmit = async () => {
      v$.value.$touch();
      if (!v$.value.$error) {
        const user = await loginRequest(state.email, state.password);
        if (user) {
          alert({
            message: `Welcome ${user.full_name}`,
            type: "positive",
          });
          goto({ name: "Dashboard" });
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
