<template>
  <q-page class="">
    <q-banner
      inline-actions
      :class="'bg-orange-4'"
      class="list-header text-white text-center"
    >
      <div class="inline bg-orange-4 rounded-borders cursor-pointer">
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          Tra cứu {{ bhyts.length }}!<br />(Bấm vào đây và lựa chọn)
        </div>

        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable @click="loadBhyts({ thang: 1 })" v-close-popup>
              <q-item-section>Tái tục 1 tháng</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhyts({ thang: 2 })" v-close-popup>
              <q-item-section>Tái tục 2 tháng</q-item-section>
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
            <q-item clickable @click="loadHoSoChuaXuLy" v-close-popup>
              <q-item-section>Hồ sơ chưa xử lý</q-item-section>
            </q-item>
            <q-item clickable @click="loadHoSoDaXuLy" v-close-popup>
              <q-item-section>Hồ sơ đã xử lý</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsTaiTuc2020" v-close-popup>
              <q-item-section>Tải dữ liệu tái tục 2020 từ SSM</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsTaiTuc2021" v-close-popup>
              <q-item-section>Tải dữ liệu tái tục 2021 từ SSM</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsTaiTuc2022" v-close-popup>
              <q-item-section>Tải dữ liệu tái tục 2022 từ SSM</q-item-section>
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
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async getAuth() {
      if (!this.key) this.key = await this.fetchUserGhiChu();
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

    async fetchAPIHoSoDaXuLy() {
      if (!this.key) await this.getAuth();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`
      };

      const API_URL =
        "https://ssm-api.vnpost.vn/api/services/app/KeKhai/TraCuuNoGroup";

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();

      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          dateForm: "ngayLap",
          denNgay: new Date(year, month + 2, 1).toISOString(),
          filterItems: [],
          hoSoChuaThuTien: false,
          hoSoQuaHan: 0,
          keyMenu: "1",
          mangLuoiId: this.userDetails.mangLuoiId,
          maxResultCount: 5000,
          skipCount: 0,
          tuNgay: new Date(year, month, 1).toISOString()
        })
      });

      const json = await res.json();
      if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
      }
      return json.result;
    },
    async fetchAPIHoSoChuaXuLy() {
      if (!this.key) await this.getAuth();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`
      };

      const API_URL =
        "https://ssm-api.vnpost.vn/api/services/app/KeKhai/TraCuuNoGroup";

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();

      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          dateForm: "ngayLap",
          denNgay: new Date(year, month + 2, 1).toISOString(),
          filterItems: [],
          hoSoChuaThuTien: false,
          hoSoQuaHan: 0,
          keyMenu: "2",
          mangLuoiId: this.userDetails.mangLuoiId,
          maxResultCount: 5000,
          skipCount: 0,
          tuNgay: new Date(year, month, 1).toISOString()
        })
      });

      const json = await res.json();
      if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
      }
      return json.result;
    },
    async fetchAPITaiTucBHYT({ denThang, tuThang }) {
      if (!this.key) await this.getAuth();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`
      };

      const API_URL =
        "https://ssm-api.vnpost.vn/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc";

      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          denThang,
          filterItems: [],
          loaiDichVu: 1,
          mangLuoiId: this.userDetails.mangLuoiId,
          maxResultCount: 5000,
          skipCount: 0,
          tuThang,
          type: -1
        })
      });

      const json = await res.json();
      if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
      }
      return json.result;
    },

    async saveBHYT(ghiChu) {
      const headers = {
        "Content-Type": "application/json"
      };

      const API_URL = "https://cms.buudienhuyenmelinh.vn/api/user-ghi-chu";

      const res = await fetch(API_URL, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ghiChu })
      });

      const text = await res.text();

      return text;
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
    async dongBoDanhSach(dsBhyts) {
      this.resetBhyt([]);
      for (let index = 0; index < dsBhyts.length; index++) {
        // const { maSoBhxh } = dsBhyts[index];
        await this.dongBo(dsBhyts[index]);
        await this.sleep(200);
      }
    },
    async dongBo(bhyt) {
      try {
        const { maSoBhxh } = bhyt;
        const {
          thongTinTK1,
          thongTinTheHGD,
          trangThaiThe
        } = await this.fetchAPIByMaSoBhxh(maSoBhxh);
        const bhytUpdate = await this.save({
          ...bhyt,
          ...thongTinTheHGD,
          ...thongTinTK1,
          ...trangThaiThe
        });
        this.updateBhyt(bhytUpdate);
      } catch (error) {
        console.log(error);
      }
    },
    async loadBhytsTaiTuc2020() {
      const { items } = await this.fetchAPITaiTucBHYT({
        denThang: "2021-01-01 00:00:00",
        tuThang: "2020-01-01 00:00:00"
      });
      this.resetBhyt(items);
      const maSos = items.map(t => ({ maSoBhxh: t.maSoBHXH }));
      await this.dongBoDanhSach(maSos);
    },
    async loadBhytsTaiTuc2021() {
      const { items } = await this.fetchAPITaiTucBHYT({
        denThang: "2022-01-01 00:00:00",
        tuThang: "2021-01-01 00:00:00"
      });
      this.resetBhyt(items);
      const maSos = items.map(t => ({ maSoBhxh: t.maSoBHXH }));
      await this.dongBoDanhSach(maSos);
    },
    async loadHoSoDaXuLy() {
      const { items } = await this.fetchAPIHoSoDaXuLy();
      this.resetBhyt(items);
      const maSos = items.map(t => ({
        ...t,
        completed: t.trangThaiHoSo !== 9,
        disabled: t.trangThaiHoSo !== 9
      }));
      await this.dongBoDanhSach(maSos);
    },
    async loadHoSoChuaXuLy() {
      const { items } = await this.fetchAPIHoSoChuaXuLy();
      this.resetBhyt(items);
      const maSos = items.map(t => ({ ...t, completed: 1, disabled: 1 }));
      await this.dongBoDanhSach(maSos);
    },
    async loadBhytsTaiTuc2022() {
      const { items } = await this.fetchAPITaiTucBHYT({
        denThang: "2023-01-01 00:00:00",
        tuThang: "2022-01-01 00:00:00"
      });
      this.resetBhyt(items);
      const maSos = items.map(t => ({ maSoBhxh: t.maSoBHXH }));
      await this.dongBoDanhSach(maSos);
    },
    loadBhyts({ thang = 1 }) {
      this.getBhyts({
        thang,
        completed: "0",
        disabled: "0",
        taiTuc: "1",
        maXa: this.userDetails.maXa
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
            this.dongBoDanhSach(dsBhyts);
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    async khoiTao() {
      if (this.$route.query.key) {
        this.key = await this.saveBHYT(this.$route.query.key);
      }
      await this.getAuth();
    }
  },
  async mounted() {
    this.khoiTao();
  }
};
</script>

<style>
.list-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
</style>
