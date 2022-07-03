<template>
  <q-page padding>
    <div class="row q-mt-lg items-center">
      <div class="col-6 q-px-lg">
        <q-img
          class="q-mt-lg"
          src="images\signup.svg"
          spinner-color="primary"
          spinner-size="82px"
        />
      </div>
      <div class="col-5 q-px-lg">
        <div class="text-h3 q-mb-lg">Sign Up</div>
        <p>
          Lorem ipsum dolor sit amet elit. Sapiente sit aut eos consectetur
          adipisicing.
        </p>
        <q-form @submit.prevent.stop="onSubmit">
          <q-input
            v-model="full_name"
            outlined
            dense
            stack-label
            label="Full Name"
            placeholder="Full Name*"
            :error="v$.full_name.$error"
            error-message="Full Name is required"
            class="q-mb-sm"
            @blur="v$.full_name.$touch()"
          >
            <template #prepend>
              <q-icon name="person" color="primary" />
            </template>
            <template #append>
              <q-icon name="close" class="cursor-pointer" @click="email = ''" />
            </template>
          </q-input>
          <q-input
            outlined
            dense
            label="Email"
            stack-label
            type="email"
            :model-value="email"
            placeholder="Email*"
            :error="v$.email.$error"
            :error-message="
              v$.email.$errors.length > 0 ? v$.email.$errors[0].$message : ''
            "
            debounce="500"
            @change="
              (nv) => {
                email = nv;
                v$.email.$touch();
              }
            "
          >
            <template #prepend>
              <q-icon name="mail" color="primary" />
            </template>
            <template #append>
              <q-icon
                name="touch_app"
                class="cursor-pointer"
                @click="checkEmailExist(email)"
              >
                <q-tooltip class="bg-accent"
                  >Check email already exists</q-tooltip
                >
              </q-icon>
            </template>
          </q-input>
          <div class="row">
            <Input-Password
              v-bind="$attrs"
              label="Password"
              stack-label
              class="q-my-sm col-6 q-pr-xs"
              outlined
              dense
              @update="(val) => (password = val)"
            />

            <Input-Password
              v-bind="$attrs"
              label="Confirm Password"
              stack-label
              class="q-my-sm col-6 q-pl-xs"
              outlined
              dense
              @update="(val) => (password = val)"
            />
          </div>
          <q-input
            v-model="mobile"
            outlined
            dense
            label="Mobile"
            stack-label
            placeholder="Mobile"
            :error="v$.mobile.$error"
            error-message="10 digit Mobile no is required"
            @blur="v$.mobile.$touch()"
          >
            <template #prepend>
              <q-icon name="phone" color="primary" />
            </template>
          </q-input>

          <q-toggle
            v-model="isAgree"
            size="xs"
            label="Agree Terms & Conditions*"
            checked-icon="check"
            color="primary"
            unchecked-icon="clear"
            class="q-my-sm"
            error-message="Accept Terms is mandatory"
            @change="$v.isAgree.$touch()"
          />

          <div>
            <q-btn
              :disabled="v$.$invalid"
              no-caps
              class="full-width"
              label="Create your account"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
        <div class="row justify-center items-center q-mt-lg">
          Already registered ?&nbsp;
          <router-link to="sign-in">Login</router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, numeric, helpers } from "@vuelidate/validators";
import useCommon from "src/hooks/useCommon";
import useAuth from "src/hooks/useAuth";
import InputPassword from "src/components/base/InputPassword.vue";

export default {
  name: "SignUpPage",
  components: {
    InputPassword,
  },
  setup() {
    const { registerRequest, emailExists } = useAuth();
    const { alert, goto } = useCommon();
    const state = reactive({
      full_name: null,
      email: null,
      password: null,
      mobile: null,
      rememberMe: false,
      isPassword: true,
      isAgree: true,
    });

    const rules = computed(() => ({
      full_name: {
        required,
      },
      email: {
        required,
        email,
        checkEmailExist: helpers.withMessage(
          "Email address already taken",
          helpers.withAsync(checkEmailExist)
        ),
      },
      mobile: {
        required,
        numeric,
        length: function (value) {
          return value.length === 10 ? true : false;
        },
      },
      isAgree: {
        checked(val) {
          return val;
        },
      },
    }));

    const checkEmailExist = async () => {
      if (v$.value) {
        if (v$.value.email.email.$invalid) return true;
        const result = await emailExists(state.email);
        // result contain true or false value
        return !result;
      }
    };
    const v$ = useVuelidate(rules, state, { lazy: true });

    const onSubmit = async () => {
      v$.value.$touch();
      if (!v$.value.$error) {
        console.log("what is full_name", state.full_name);
        const user = await registerRequest({
          full_name: state.full_name,
          email: state.email,
          password: state.password,
          mobile: state.mobile,
        });
        if (user) {
          alert({
            message: `Please check your mail and activate your account`,
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
      checkEmailExist,
    };
  },
};
</script>
