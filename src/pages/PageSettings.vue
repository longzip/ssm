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
        <q-input
          v-model="formData.smsText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu gửi tin SMS"
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
        smsText: ""
      }
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
    let { name, email, smsText } = this.userDetails;
    this.formData = { name, email, smsText };
  }
};
</script>

<style></style>
