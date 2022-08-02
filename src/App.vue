<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("store", ["handleAuthStateChanged"]),
    // ...mapActions("vaccines", ["getAllVaccines"])
  },
  mounted() {
    this.handleAuthStateChanged();
    // this.getAllVaccines();
  }
};
</script>
