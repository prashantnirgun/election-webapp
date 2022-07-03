<template>
  <q-input
    v-model="password"
    :type="isPassword ? 'password' : 'text'"
    placeholder="Password"
    autocomplete="off"
    :error="v$.password.$error"
    :error-message="
      v$.password.$errors.length > 0 ? v$.password.$errors[0].$message : ''
    "
    @blur="
      v$.password.$touch();
      $emit('update', password);
    "
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
</template>
<script>
import { reactive, toRefs, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, sameAs } from "@vuelidate/validators";
/**
 * todo : Password Strength
 * https://github.com/miladd3/vue-simple-password-meter/tree/next/src
 */
export default {
  name: "InputPassword",
  props: {
    // classes: {
    //   type: String,
    //   default: "",
    // },
    // dense: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  emits: ["update"],
  setup(props) {
    const state = reactive({
      password: null,
      isPassword: true,
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
    }));
    const v$ = useVuelidate(rules, state, { lazy: true });

    return { ...props, ...toRefs(state), v$ };
  },
};
</script>
