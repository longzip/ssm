<template>
  <q-item
    :class="{
      'bg-warning': bhyt.coTheUuTienCaoHon,
      'bg-warning': bhyt.coTheUuTienCaoHon === '1',
      'bg-positive': getDateDiff(bhyt.denNgayDt) > 30,
      'bg-blue-grey-3': getDateDiff(bhyt.denNgayDt) < 1
    }"
  >
    <q-item-section>
      <q-item-label
        ><q-icon
          :class="bhyt.gioiTinh == 1 ? 'text-pink' : 'text-primary'"
          :name="bhyt.gioiTinh == 1 ? 'female' : 'male'"
        />{{ bhyt.hoTen || bhyt.hoVaTen }}
        {{ bhyt.ngaySinhDt || bhyt.ngayThangNamSinh }}

        <q-icon
          @click="xacNhanLoaiBo(bhyt)"
          :name="bhyt.disabled == 1 ? 'do_not_disturb_on' : 'delete_forever'"
          :color="bhyt.disabled == 1 ? 'red' : 'gray'"
        />
      </q-item-label>
      <q-item-label caption lines="2">
        {{ bhyt.diaChiLh }}
      </q-item-label>
      <q-item-label caption lines="2">
        Mã hộ:<a target="_blank" :href="`/#/ho-gia-dinh/${bhyt.maHoGd}`">{{
          bhyt.maHoGd
        }}</a>
        {{ bhyt.mqhChuHo }}
      </q-item-label>
      <q-item-label caption lines="2">
        Số CMND: {{ bhyt.soCmnd }}
      </q-item-label>
      <q-item-label caption lines="2"
        ><a
          target="_blank"
          :href="
            `https://www.buudienxatulap.ga/tra-thoi-han-bao-hiem-y-te?q=${
              bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
            }`
          "
          >{{
            bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
          }}</a
        >
        <q-icon
          class="q-ml-md"
          @click="
            copyTextToClipboard(
              bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
            )
          "
          name="content_copy"
        />

        <q-icon
          class="q-ml-md"
          @click="
            copyUrlToClipboard(
              bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
            )
          "
          name="share"
        />
      </q-item-label>
      <q-item-label caption lines="2">{{ bhyt.maKCB }}</q-item-label>
      <q-item-label caption lines="2"
        >5 năm:{{ bhyt.ngay5Nam || bhyt.trangThaiHoSoName }}</q-item-label
      >

      <q-item-label caption lines="2">
        <a :href="`tel:${bhyt.soDienThoai}`">{{ bhyt.soDienThoai }}</a>
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label caption
        >{{ getDateDiff(bhyt.denNgayDt) }} ngày</q-item-label
      >
      <q-item-label caption
        >Ngày đến hạn:{{ bhyt.denNgayDt || bhyt.ngayDenHan }}</q-item-label
      >
      <q-item-label caption>Phương thức:{{ bhyt.phuongThuc }}</q-item-label>
      <q-item-label caption
        >đ
        <strong
          >{{ bhyt.tongTien ? parseInt(bhyt.tongTien).toLocaleString() : ""
          }}{{
            bhyt.soPhaiDong ? parseInt(bhyt.soPhaiDong).toLocaleString() : ""
          }}</strong
        ></q-item-label
      >
      <q-icon
        @click="xacNhanTheoDoi(bhyt)"
        name="star"
        :color="bhyt.completed == 1 ? 'yellow' : 'gray'"
      />
      <q-item-label caption
        >{{ bhyt.ngayLap || new Date(bhyt.updated_at).toLocaleString() }}<br />
        {{ bhyt.soBienLai ? `Số: ${bhyt.soBienLai}` : bhyt.ghiChu }}<br />
        {{ bhyt.userName }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions } from "vuex";
import { date } from "quasar";
import { Notify } from "quasar";
export default {
  props: ["bhyt"],
  methods: {
    ...mapActions("bhyts", ["loaiBo", "theoDoi"]),
    xacNhanLoaiBo(bhyt) {
      if (!bhyt.maSoBhxh) bhyt.maSoBhxh = bhyt.maSoBHXH;
      this.$q
        .dialog({
          title: "Confirm",
          message: "Bạn có muốn loại bỏ?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          this.loaiBo(bhyt);
        });
    },
    xacNhanTheoDoi(bhyt) {
      if (!bhyt.maSoBhxh) bhyt.maSoBhxh = bhyt.maSoBHXH;
      this.$q
        .dialog({
          title: "Confirm",
          message: "Bạn có muốn theo dõi?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          this.theoDoi(bhyt);
        });
    },
    getDateDiff(ngayHetHan) {
      if (!ngayHetHan) return "";
      return date.getDateDiff(new Date(ngayHetHan), new Date(), "days");
    },
    copyUrlToClipboard(maSoBhxh) {
      navigator.clipboard
        .writeText(
          `Chỉ cần nhập mã số thẻ BHYT vào ô tra cứu là biết ngay thẻ khi nào hết hạn, xem được số tiền đã mua tại https://thambuudien.ga/tra-thoi-han-bao-hiem-y-te/?q=${maSoBhxh}`
        )
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
    },
    copyTextToClipboard(maSoBhxh) {
      navigator.clipboard.writeText(maSoBhxh).then(
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
  filters: {
    tien: function(value) {
      if (!value) return "0đ";
      return parseInt(value).toLocaleString();
    }
  }
};
</script>
