<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        :icon="leftDrawerOpen ? 'menu_open' : 'format_indent_increase'"
        aria-label="Menu"
        :class="[leftDrawerOpen ? 'rotate-180' : 'rotate-360']"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title> TSS Support Portal </q-toolbar-title>

      <q-btn
        v-if="!isLoggedIn"
        flat
        icon="fas fa-sign-in-alt"
        to="authentication"
      />
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
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Navbar",
  props: {
    isLoggedIn: {
      type: Boolean,
      default: true,
    },
    leftDrawerOpen: {
      type: Boolean,
      default: true,
    },
  },
  setup(prop) {
    const a = 10;

    return { ...prop };
  },
});
</script>
