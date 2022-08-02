<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-avatar>
          <img src="/logo.png" />
        </q-avatar>
        <q-toolbar-title class="absolute-center">
          Bưu điện huyện Mê Linh
        </q-toolbar-title>

        <q-btn
          v-if="!userDetails.userId"
          to="/auth"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Đăng nhập"
        />
        <q-btn
          v-else
          @click="logoutUser"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
        >
          {{ userDetails.name }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-footer v-if="userDetails.userId">
      <q-tabs>
        <q-route-tab
          v-for="nav in navs"
          :key="nav.label"
          :to="nav.to"
          :icon="nav.icon"
          :label="nav.label"
        />
      </q-tabs>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="767"
      :width="250"
      bordered
      content-class="bg-primary"
      v-if="userDetails.userId"
    >
      <q-list dark>
        <q-item-label header>Chức năng</q-item-label>

        <q-item
          v-for="nav in navs"
          :key="nav.label"
          :to="nav.to"
          class="text-grey-4"
          exact
          clickable
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import { mapState, mapActions } from "vuex";
// import mixinOtherUserDetails from "src/mixins/mixin-other-user-details.js";

export default {
  name: "MyLayout",
  // mixins: [mixinOtherUserDetails],
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      navs: [
        {
          label: "Tra cứu",
          icon: "list",
          to: "/"
        },
        {
          label: "Cấu hình",
          icon: "settings",
          to: "/settings"
        }
      ]
    };
  },
  computed: {
    ...mapState("store", ["userDetails"])
  },
  methods: {
    ...mapActions("store", ["logoutUser"]),
    openURL
  }
};
</script>

<style lang="scss">
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
}

.q-drawer {
  .q-router-link--exact-active {
    color: white !important;
  }
}
</style>
