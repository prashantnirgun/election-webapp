<template>
  <q-page padding>
    <div class="row q-mt-lg">
      <div class="col-6 q-px-lg">
        <q-img
          class=""
          src="images\update-password.svg"
          spinner-color="primary"
          spinner-size="82px"
        />
      </div>
      <div class="col-4 q-px-lg">
        <div class="text-h3 q-mb-lg">Update Password</div>
        <p>
          Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur
          adipisicing.
        </p>
        <q-form @submit.prevent.stop="onSubmit">
          <q-input
            v-model="email"
            outlined
            label="User Name"
            dense
            stack-label
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
          <q-btn color="primary" no-caps label="Reset Password" />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import useCommon from "src/hooks/useCommon";
import useAuth from "src/hooks/useAuth";
export default {
  name: "UpdatePasswordPage",
  setup() {
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
