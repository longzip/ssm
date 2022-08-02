import Vue from "vue";
import axios from "axios";

Vue.prototype.$axios = axios;
Vue.prototype.$axios.defaults.baseURL = "https://app.tiemchunggiongvina.com/";
Vue.filter("ngayThangNam", function(value) {
  if (!value) return "";
  value = value.toString().slice(0, 10);
  const dateParts = value.split("-");
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
});
