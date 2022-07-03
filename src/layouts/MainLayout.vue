<template>
  <q-layout view="hHh LpR lFf">
    <q-header class="bg-navbar">
      <q-toolbar>
        <!-- <q-btn
          flat
          dense
          round
          :icon="leftDrawerOpen ? 'menu_open' : 'format_indent_increase'"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          :class="[leftDrawerOpen ? 'rotate-180' : 'rotate-360']"
        />
-->
        <q-toolbar-title>{{ siteName }}</q-toolbar-title>

        <q-space />
        <q-btn to="/" stretch no-caps flat label="Home" />
        <q-btn to="/admin/dashboard" stretch no-caps flat label="Dashboard" />
        <q-btn to="/panel" stretch no-caps flat label="Panel" />
        <q-btn to="/wards" stretch no-caps flat label="Wards" />
        <q-btn to="/volunteers" stretch no-caps flat label="Volunteers" />
        <q-btn to="/schedule" stretch no-caps flat label="Schedule" />

        <q-btn-dropdown no-caps flat label="Admin" v-if="isLoggedIn">
          <q-list dense>
            <q-item clickable v-close-popup to="/admin/dashboard">
              <q-item-section>
                <q-item-label>dashboard</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup to="/admin/voters">
              <q-item-section>
                <q-item-label>Voters</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup to="/admin/areas">
              <q-item-section>
                <q-item-label>Area</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup to="/admin/cities">
              <q-item-section>
                <q-item-label>City</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/admin/candidates">
              <q-item-section>
                <q-item-label>Candidates</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/admin/volunteers">
              <q-item-section>
                <q-item-label>Volunteers</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/admin/wards">
              <q-item-section>
                <q-item-label>Wards</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn to="/contact" stretch no-caps flat label="Contact" />
        <q-btn v-if="!isLoggedIn" to="sign-in" flat icon="fas fa-sign-in-alt">
        </q-btn>

        <q-btn v-if="isLoggedIn" flat icon="account_circle">
          <q-menu auto-close transition-show="scale" transition-hide="scale">
            <q-item v-ripple clickable to="profile">
              <q-item-section side>
                <q-avatar rounded size="48px">
                  <img :src="imageUrl" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ userName }}</q-item-label>
                <q-item-label caption>Account</q-item-label>
              </q-item-section>
            </q-item>

            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>Feedback</q-item-section>
              </q-item>
              <q-item> Version {{ version }} </q-item>
              <q-separator />
              <q-item clickable class="text-purple" @click="logout">
                <q-item-section>Logout</q-item-section>
                <q-icon name="cloud_off" size="md"></q-icon>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :mini="minSidebar"
    >
      <q-img
        v-if="!minSidebar"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">{{ userName }}</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>

      <Sidebar
        :options="roots"
        @expandBar="onExpandBar"
        :min-sidebar="minSidebar"
      />
      <q-list>
        <q-item clickable @click="toggleMiniSidebar">
          <q-item-section avatar>
            <q-icon
              color="primary"
              :name="minSidebar ? 'arrow_circle_right' : 'arrow_circle_left'"
              size="md"
            />
          </q-item-section>
          <q-item-section class="text-left">Icon only</q-item-section>
        </q-item>
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
//import Sidebar from "./Sidebar.vue";

//import { useStore } from "vuex";
import { defineComponent, ref, computed } from "vue";
import { useGlobalStore } from "src/stores/global";
import roots from "src/config/menu.json";
import useAuth from "src/hooks/useAuth";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "MainLayout",
  components: {
    //   Sidebar,
  },
  setup() {
    const store = useGlobalStore();
    const leftDrawerOpen = ref(false);
    const minSidebar = ref(true);
    const userName = store.getUserName;
    const isLoggedIn = store.isLoggedIn;
    const version = "v1"; // computed(() => store.getters["version"]);
    const { logoutRequest } = useAuth();
    const router = useRouter();
    const siteName = process.env.SITE_NAME;
    const onExpandBar = () => {
      minSidebar.value = false;
      if (leftDrawerOpen.value) {
        leftDrawerOpen.value = true;
      }
    };
    const toggleMiniSidebar = () => {
      minSidebar.value = !minSidebar.value;
    };

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };
    const imageUrl = computed(() => {
      return `https://avatars.dicebear.com/api/adventurer/${userName.value}.svg`;
    });
    console.log("is user", isLoggedIn);
    const logout = async () => {
      await logoutRequest();
      router.push({ name: "Home" });
    };

    return {
      userName,
      roots,
      leftDrawerOpen,
      onExpandBar,
      minSidebar,
      toggleMiniSidebar,
      toggleLeftDrawer,
      isLoggedIn,
      imageUrl,
      logout,
      version,
      siteName,
    };
  },
});
</script>

<style lang="sass" scoped>
.rotate-180
  transform: rotate(180deg)
  transition: 0.2s linear

.rotate-360
  transform: rotate(360deg)
  transition: 0.2s linear
</style>

<style lang="sass">
a
  text-decoration: none
</style>
