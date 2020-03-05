import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Vuetify from "vuetify/lib";
import router from "./Router/index";
import store from "./Store/index";

Vue.use(router);
Vue.use(Vuetify);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
