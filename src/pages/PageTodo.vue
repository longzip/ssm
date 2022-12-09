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
            <q-item clickable @click="loadBhytByNamSinh" v-close-popup>
              <q-item-section>Tìm theo năm sinh</q-item-section>
            </q-item>
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
            <q-item clickable @click="loadHoSoDaNopBD" v-close-popup>
              <q-item-section>Hồ sơ đã nộp</q-item-section>
            </q-item>
            <q-item clickable @click="loadHoSoDaXuLy" v-close-popup>
              <q-item-section>Hồ sơ đã xử lý</q-item-section>
            </q-item>
            <q-item clickable @click="loadBaoCaoChiTietGiaoDich" v-close-popup>
              <q-item-section>Báo cáo Chi Tiết Giao Dịch</q-item-section>
            </q-item>
            <q-item clickable @click="inC17" v-close-popup>
              <q-item-section>In C17</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsTaiTuc2020" v-close-popup>
              <q-item-section>Tải dữ liệu tái tục mới nhất</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsTaiTuc2021" v-close-popup>
              <q-item-section>Tải dữ liệu tái tục 2021 từ SSM</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsTaiTuc2022" v-close-popup>
              <q-item-section>Tải dữ liệu tái tục 2022 từ SSM</q-item-section>
            </q-item>
            <q-item clickable @click="copyMaSoBhxhToClipboard" v-close-popup>
              <q-item-section>Copy tất cả mã số BHXH</q-item-section>
            </q-item>
            <q-item clickable @click="copySoDienThoaiToClipboard" v-close-popup>
              <q-item-section>Copy tất cả số điện thoại</q-item-section>
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
import { Loading, QSpinnerIos, Notify } from "quasar";
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

    async fetchAPIHoSoDaXuLy({ tuNgay, denNgay }) {
      const docSo = parseInt(this.searchText);
      let soThang = 0;
      if (docSo) soThang = docSo;
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
          denNgay:
            denNgay ?? new Date(year, month - soThang + 2, 1).toISOString(),
          filterItems: [],
          hoSoChuaThuTien: false,
          hoSoQuaHan: 0,
          keyMenu: "1",
          mangLuoiId: this.userDetails.mangLuoiId,
          maxResultCount: 5000,
          skipCount: 0,
          tuNgay: tuNgay ?? new Date(year, month - soThang, 1).toISOString()
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
    async fetchAPIBaoCaoChiTietGiaoDich({ denThang, tuThang }) {
      if (!this.key) await this.getAuth();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`
      };

      const API_URL =
        "https://ssm-api.vnpost.vn/api/services/app/BaoCaoTongHopGDThu/BaoCaoChiTietGiaoDich";

      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          denThang,
          filterItems: [],
          loaiGiaoDich: 0,
          mangLuoiId: parseInt(this.userDetails.mangLuoiId),
          maxResultCount: 5000,
          skipCount: 0,
          tuThang
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
          loaiDichVu: parseInt(this.searchText),
          mangLuoiId: parseInt(this.userDetails.mangLuoiId),
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
      this.$q
        .dialog({
          title: "Confirm",
          message: `Bạn có muốn đồng bộ ${dsBhyts.length} thẻ BHYT?`,
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(async () => {
          Loading.show({
            spinner: QSpinnerIos,
            spinnerSize: "100px"
          });
          this.resetBhyt([]);
          for (let index = 0; index < dsBhyts.length; index++) {
            const { maSoBhxh } = dsBhyts[index];
            const found = this.bhyts.find(b => b.maSoBhxh === maSoBhxh);
            if (!found) await this.dongBo(dsBhyts[index]);
            await this.sleep(500);
          }
          Loading.hide();
        });
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
    async loadBaoCaoChiTietGiaoDich() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const { items } = await this.fetchAPIHoSoDaXuLy({
        tuNgay: new Date(year, month + 2, 1).toISOString(),
        denNgay: new Date(year, month, 1).toISOString()
      });
      this.resetBhyt(items);
      const maSos = items.map(t => ({ maSoBhxh: t.maSoBHXH }));
      await this.dongBoDanhSach(maSos);
    },
    async inC17() {
      const [year, month, ngay] = new Date()
        .toISOString()
        .slice(0, 10)
        .split("-");
      const ds = new Map();
      for (let index = 1; index < 10; index++) {
        await ds.set(`${this.searchText}0${index}`, {
          tongTien: 0,
          tienBHYT: 0,
          tienBHXH: 0,
          soBienLai: `${this.searchText}0${index}`,
          ngayLap: null
        });
      }
      for (let index = 10; index < 100; index++) {
        await ds.set(`${this.searchText}${index}`, {
          tongTien: 0,
          tienBHYT: 0,
          tienBHXH: 0,
          soBienLai: `${this.searchText}${index}`,
          ngayLap: null
        });
      }
      await ds.set(`${parseInt(this.searchText + 99) + 1}`, {
        tongTien: 0,
        tienBHYT: 0,
        tienBHXH: 0,
        soBienLai: `${parseInt(this.searchText + 99) + 1}`,
        ngayLap: null
      });

      const { items } = await this.fetchAPIHoSoDaXuLy({
        denNgay: new Date(year, month, ngay).toISOString(),
        tuNgay: new Date(year, month - 3, ngay).toISOString()
      });
      const xuatc17 = await items.filter(t =>
        t.soBienLai.startsWith(this.searchText ?? "15535")
      );
      for (let index = 0; index < items.length; index++) {
        const t = items[index];
        if (t.userId === 3152 && ds.has(t.soBienLai)) {
          const g = ds.get(t.soBienLai);
          ds.set(t.soBienLai, {
            ...g,
            ngayLap: t.ngayLap,
            tienBHYT:
              t.maThuTuc === 1 ? parseInt(t.tongTien) + g.tienBHYT : g.tienBHYT,
            tienBHXH:
              t.maThuTuc === 0 ? parseInt(t.tongTien) + g.tienBHXH : g.tienBHXH,
            tongTien: parseInt(t.tongTien) + g.tongTien
          });
        }
      }
      await this.sleep(5000);
      const res = await fetch(
        `https://cms.buudienhuyenmelinh.vn/api/mau-c17-all/1/pdf?tienBHYT=${xuatc17
          .filter(t => t.maThuTuc == 1)
          .map(t => t.tongTien)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )}&tienBHXH=${xuatc17
          .filter(t => t.maThuTuc == 0)
          .map(t => t.tongTien)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify([...ds.values()])
        }
      );

      const blob = await res.blob();
      if (blob.errors) {
        console.error(blob.errors);
        throw new Error("Failed to fetch API");
      }

      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${new Date()
        .toISOString()
        .slice(0, 10)}-tham-tu-lap-c17.pdf`;
      link.click();
    },
    async loadBhytsTaiTuc2020() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const { items } = await this.fetchAPITaiTucBHYT({
        denThang: new Date(year, month + 2, 1).toISOString(),
        tuThang: new Date(year, month, 1).toISOString()
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
        userName: t.userName,
        ngayLap: t.ngayLap,
        tongTien: t.tongTien,
        // completed: t.trangThaiHoSo !== 9,
        disabled: t.trangThaiHoSo !== 9
      }));
      await this.dongBoDanhSach(maSos);
    },
    async loadHoSoDaNopBD() {
      const { items } = await this.fetchAPIHoSoDaXuLy();
      this.resetBhyt(items);
      const maSos = items
        .filter(
          t =>
            t.userId == 3152 &&
            t.trangThaiHoSo == 4 &&
            new Date().toISOString().slice(0, 10) ===
              new Date(t.ngayNopHoSo).toISOString().slice(0, 10)
        )
        .map(t => ({
          ...t,
          userName: t.userName,
          ngayLap: t.ngayLap,
          tongTien: t.tongTien,
          // completed: t.trangThaiHoSo !== 9,
          disabled: t.trangThaiHoSo !== 9
        }));
      await this.dongBoDanhSach(maSos);
      await this.print(maSos.map(t => t.maSoBhxh).join());
    },
    async print(maSoBhxhs) {
      let a = document.createElement("a");
      a.target = "_blank";
      let lienKet = `https://cms.buudienhuyenmelinh.vn/mau-c17/${new Date()
        .toISOString()
        .slice(0, 10)}/pdf?maSoBhxhs=${maSoBhxhs}`;
      a.href = lienKet;
      a.click();
    },
    async loadHoSoChuaXuLy() {
      const { items } = await this.fetchAPIHoSoChuaXuLy();
      this.resetBhyt(items);
      const maSos = items.map(t => ({
        ...t,
        userName: t.userName,
        ngayLap: t.ngayLap,
        tongTien: t.tongTien,
        completed: 1,
        disabled: 1
      }));
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
    loadBhytByNamSinh() {
      this.getBhyts({
        completed: "0",
        disabled: "0",
        maXa: this.userDetails.maXa,
        nam: this.searchText
      });
    },
    loadBhyts({ thang = 1 }) {
      this.getBhyts({
        thang,
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
        hetHan: "1",
        name: this.searchText
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
      this.traCuuBhyts({ searchText, maXa: this.userDetails.maXa });
      const danhSachTimKiem = searchText.split(",");
      const regex = /[0-9]/g;
      for (let index = 0; index < danhSachTimKiem.length; index++) {
        const name = danhSachTimKiem[index]
          .split(" ")
          .map(value => value.charAt(0).toUpperCase() + value.slice(1))
          .join(" ");
        const maSo = name.match(regex);
        if (maSo) {
          await this.dongBo({ maSoBhxh: maSo.join("") });
          await this.sleep(500);
        } else {
          try {
            const dsBhyts = await this.fetchAPIByName(name);
            for (let index = 0; index < dsBhyts.length; index++) {
              // const { maSoBhxh } = dsBhyts[index];
              await this.dongBo(dsBhyts[index]);
              await this.sleep(500);
            }
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
    },
    copyMaSoBhxhToClipboard() {
      navigator.clipboard.writeText(this.bhyts.map(bhyt => bhyt.maSoBhxh)).then(
        function() {
          Notify.create({
            type: "positive",
            message: `Bạn đã sao chép thành công!`
          });
        },
        function(err) {
          Notify.create({
            type: "negative",
            message: "Không thực hiện được!" + err
          });
        }
      );
    },
    copySoDienThoaiToClipboard() {
      navigator.clipboard
        .writeText(this.bhyts.map(bhyt => bhyt.soDienThoai))
        .then(
          function() {
            Notify.create({
              type: "positive",
              message: `Bạn đã sao chép thành công!`
            });
          },
          function(err) {
            Notify.create({
              type: "negative",
              message: "Không thực hiện được!" + err
            });
          }
        );
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
