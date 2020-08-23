import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import jquery from "jquery";
import {
  ValidationObserver,
  ValidationProvider,
  configure,
  localize,
  extend
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import zhTW from "vee-validate/dist/locale/zh_TW.json";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "./bus";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import App from "./App.vue";
import router from "./router";
import currencyFilter from "./filters/currency";

window.$ = jquery;

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.filter("currency", currencyFilter);
Vue.use(Loading);
Vue.component("Loading", Loading);

// vee-validate
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
}); // 所有驗證規則
configure({
  classes: {
    valid: "is-valid",
    invalid: "is-invalid"
  }
});
localize("tw", zhTW);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
