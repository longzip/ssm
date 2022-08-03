<template>
  <q-page>
    <q-card class="q-pa-md">
      <q-form @submit="luuThongTin" class="q-gutter-md">
        <q-input
          filled
          v-model="formData.name"
          label="Tên của bạn *"
          hint="Tên hoặc họ và tên"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Vui lòng cho biết tên của bạn'
          ]"
        />
        <q-input
          v-model="formData.email"
          class="q-mb-md"
          outlined
          type="email"
          label="Tên đăng nhập"
          disable
        />
        <q-select
          filled
          v-model="formData.maXa"
          :options="options"
          label="Mã xã"
          emit-value
        />
        <q-input
          v-model="formData.smsText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu gửi tin SMS"
        />
        <q-input
          v-model="formData.isLogin"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Khóa bí mật"
        />
        <div>
          <q-btn label="Cập nhật" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        maXa: "",
        smsText: ""
      },
      options: [
        { label: "08973 - Thị trấn Chi Đông", value: "08973" },
        { label: "08974 - Xã Đại Thịnh", value: "08974" },
        { label: "08977 - Xã Kim Hoa", value: "08977" },
        { label: "08980 - Xã Thạch Đà", value: "08980" },
        { label: "08983 - Xã Tiến Thắng", value: "08983" },
        { label: "08986 - Xã Tự Lập", value: "08986" },
        { label: "08989 - Thị trấn Quang Minh", value: "08989" },
        { label: "08992 - Xã Thanh Lâm", value: "08992" },
        { label: "08995 - Xã Tam Đồng", value: "08995" },
        { label: "08998 - Xã Liên Mạc", value: "08998" },
        { label: "09001 - Xã Vạn Yên", value: "09001" },
        { label: "09004 - Xã Chu Phan", value: "09004" },
        { label: "09007 - Xã Tiến Thịnh", value: "09007" },
        { label: "09010 - Xã Mê Linh", value: "09010" },
        { label: "09013 - Xã Văn Khê", value: "09013" },
        { label: "09016 - Xã Hoàng Kim", value: "09016" },
        { label: "09019 - Xã Tiền Phong", value: "09019" },
        { label: "09022 - Xã Tráng Việt", value: "09022" }
      ]
    };
  },
  computed: {
    ...mapState("store", ["userDetails"])
  },
  methods: {
    ...mapActions("store", ["firebaseUpdateUser", "handleAuthStateChanged"]),
    luuThongTin() {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn có muốn lưu thông tin cấu hình",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          // console.log(">>>> OK, received", data);
          this.firebaseUpdateUser({
            userId: this.userDetails.userId,
            updates: this.formData
          });
          this.handleAuthStateChanged();
        });
    }
  },
  created() {
    // let { name, email, smsText, maXa } = this.userDetails;
    this.formData = { ...this.userDetails };
  }
};
</script>

<style></style>
