import Vuex from "vuex";
import Vue from "vue";
import personel from "../modules/getPersonel";
import global from '../modules/global'; 
// Load Vuex
Vue.use(Vuex);

// Create Store

export default new Vuex.Store({
  modules: {
    personel,
    global
  }
});
