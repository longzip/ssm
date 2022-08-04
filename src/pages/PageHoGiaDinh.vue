<template>
  <q-page class="">
    <q-banner
      inline-actions
      :class="'bg-orange-4'"
      class="list-header text-white text-center"
    >
      <div class="inline bg-orange-4 rounded-borders cursor-pointer">
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          Hộ gia đình:
          <a
            target="_blank"
            :href="
              `https://www.buudienhuyenmelinh.vn/gia-han-the-bhyt-tai-nha?maHoGD=${maHoGd}`
            "
            >{{ maHoGd }}</a
          >
          <br />(Bấm vào đây và lựa chọn)
        </div>

        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable @click="dongBo()" v-close-popup>
              <q-item-section>Đồng bộ</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-banner>
    <q-list v-for="bhyt in bhyts" :key="bhyt.id">
      <ThongTinTheBHYT :bhyt="bhyt" />
      <q-separator spaced inset />
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
export default {
  components: { ThongTinTheBHYT },
  data() {
    return {
      maHoGd: ""
    };
  },
  computed: {
    ...mapGetters("bhyts", ["bhyts"])
  },
  methods: {
    ...mapActions("bhyts", ["getBhyts"]),
    dongBo() {
      console.log("đồng bộ");
    },
    async loadData() {
      await this.getBhyts({
        maHoGd: this.maHoGd
      });
    }
  },
  mounted() {
    this.maHoGd = this.$route.params.id;
    this.loadData();
  }
};
</script>

<style>
.list-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
</style>
