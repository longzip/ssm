<template>
  <q-page class="">
    <q-banner
      inline-actions
      :class="'bg-orange-4'"
      class="list-header text-white text-center"
    >
      <div class="inline bg-orange-4 rounded-borders cursor-pointer">
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          Tra cứu!<br />(Bấm vào đây và lựa chọn)
        </div>

        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable @click="loadBhyts" v-close-popup>
              <q-item-section>Tái tục</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsHetHan" v-close-popup>
              <q-item-section>Đã hết hạn</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsDisable" v-close-popup>
              <q-item-section>Đã liên hệ</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsCompleted" v-close-popup>
              <q-item-section>Đánh dấu sao</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-banner>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        @keyup.enter="timKiem(searchText)"
        dense
      >
        <template v-slot:append>
          <q-icon
            v-if="searchText !== ''"
            name="close"
            @click="searchText = ''"
            class="cursor-pointer"
          />
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-list v-for="bhyt in bhyts" :key="bhyt.id">
      <ThongTinTheBHYT :bhyt="bhyt" />
      <q-separator spaced inset />
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
export default {
  components: { ThongTinTheBHYT },
  data() {
    return {
      searchText: "",
      key: ""
    };
  },
  computed: {
    ...mapGetters("bhyts", ["bhyts"]),
    ...mapState("store", ["userDetails"])
  },
  methods: {
    ...mapActions("bhyts", [
      "getBhyts",
      "traCuuBhyts",
      "updateBhyt",
      "resetBhyt"
    ]),
    async getAuth() {
      this.key = await this.fetchUserGhiChu();
    },
    async fetchAPIByName(searchText) {
      if (!this.key) await this.getAuth();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`
      };

      const { maXa = "08986" } = this.userDetails;

      const API_URL = `https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuMaSoBHXH?maTinh=01&maHuyen=250&maXa=${maXa}&hoTen=${searchText}&isCoDau=true&`;

      const res = await fetch(API_URL, {
        method: "GET",
        headers
      });

      const json = await res.json();
      if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
      }

      return json.result.value;
    },

    async fetchAPIByMaSoBhxh(maSoBhxh) {
      if (!this.key) await this.getAuth();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`
      };

      const API_URL = `https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${maSoBhxh.slice(
        maSoBhxh.length - 10
      )}`;

      const res = await fetch(API_URL, {
        method: "GET",
        headers
      });

      const json = await res.json();
      if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
      }
      return json.result;
    },

    async fetchUserGhiChu() {
      const headers = {
        "Content-Type": "application/json"
      };

      const API_URL = "https://cms.buudienhuyenmelinh.vn/api/user-ghi-chu";

      const res = await fetch(API_URL, {
        method: "GET",
        headers
      });
      const text = await res.text();
      return text;
    },

    async save(bhyt) {
      const headers = {
        "Content-Type": "application/json"
      };

      const API_URL = "https://cms.buudienhuyenmelinh.vn/api/bhyts";

      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(bhyt)
      });

      const json = await res.json();
      if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
      }
      return json;
    },
    async dongBo(maSoBhxh) {
      try {
        const {
          thongTinTK1,
          thongTinTheHGD,
          trangThaiThe
        } = await this.fetchAPIByMaSoBhxh(maSoBhxh);
        const theBHYT = { ...thongTinTheHGD, ...thongTinTK1, ...trangThaiThe };
        let found = this.bhyts.find(
          x =>
            x.maSoBhxh === theBHYT.maSoBhxh || x.soSoBhxh === theBHYT.soSoBhxh
        );
        if (!found) {
          const bhyt = await this.save(theBHYT);
          this.updateBhyt(bhyt);
        }
      } catch (error) {
        console.log(error);
      }
    },
    loadBhyts() {
      this.getBhyts({
        thang: 2,
        completed: "0",
        disabled: "0",
        taiTuc: "1",
        maXa: this.userDetails.maXa,
        name: this.searchText
      });
    },
    loadBhytsHetHan() {
      this.getBhyts({
        maXa: this.userDetails.maXa,
        completed: "0",
        disabled: "0",
        hetHan: "1"
      });
    },
    loadBhytsDisable() {
      this.getBhyts({
        maXa: this.userDetails.maXa,
        disabled: 1
      });
    },
    loadBhytsCompleted() {
      this.getBhyts({
        maXa: this.userDetails.maXa,
        completed: 1,
        disabled: "0"
      });
    },
    async timKiem(searchText) {
      this.traCuuBhyts(searchText);
      const danhSachTimKiem = searchText.split(",");
      const regex = /[0-9]/g;
      for (let index = 0; index < danhSachTimKiem.length; index++) {
        const name = danhSachTimKiem[index]
          .split(" ")
          .map(value => value.charAt(0).toUpperCase() + value.slice(1))
          .join(" ");
        const maSo = name.match(regex);
        if (maSo) {
          await this.dongBo(maSo.join(""));
        } else {
          try {
            const dsBhyts = await this.fetchAPIByName(name);
            for (let index = 0; index < dsBhyts.length; index++) {
              const { maSoBhxh } = dsBhyts[index];
              await this.dongBo(maSoBhxh);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  },
  async mounted() {
    await this.getAuth();
  }
};
</script>

<style>
.list-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
</style>
