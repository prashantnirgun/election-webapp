<template>
  <q-page padding>
    <div class="row q-mt-lg items-center">
      <div class="col-6 q-px-lg">
        <q-img
          class=""
          src="images\signin.svg"
          :ratio="16 / 9"
          spinner-color="primary"
          spinner-size="82px"
        />
      </div>
      <div class="col-4 q-px-lg">
        <div class="text-h3 q-mb-lg">Sign In</div>
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

          <Input-Password
            v-bind="$attrs"
            class="q-my-md"
            outlined
            label="Password"
            stack-label
            dense
            @update="(val) => (password = val)"
          />

          <div class="row justify-between items-center">
            <q-checkbox
              v-model="rememberMe"
              class="text-grey-8 q-my-md"
              dense
              label="Remember me"
              color="primary"
            ></q-checkbox>
            <router-link to="forgot-password">Forgot Password</router-link>
          </div>
          <div>
            <q-btn
              class="full-width"
              label="Login"
              type="submit"
              color="primary"
              :disabled="v$.$invalid"
            />
          </div>
          <div class="row justify-center items-center q-mt-lg">
            Don't have account ?&nbsp;
            <router-link to="sign-up">Register</router-link>
          </div>
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
import InputPassword from "src/components/base/InputPassword.vue";
import { useGlobalStore } from "src/stores/global";
export default {
  name: "SignInPage",
  components: {
    InputPassword,
  },
  setup() {
    const { loginRequest } = useAuth();
    const { alert, goto } = useCommon();
    const global = useGlobalStore();
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
        console.log("user===>", user);
        if (user) {
          alert({
            message: `Welcome ${user.full_name}`,
            type: "positive",
          });
          goto({ name: "Dashbaord" });
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
