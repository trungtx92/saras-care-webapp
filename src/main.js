// Import the dependencies and necessary modules
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from './store/store.js';

import BootstrapVue from 'bootstrap-vue'
import VueGoodTablePlugin from 'vue-good-table';
import Buefy from "buefy"
import Vuelidate from 'vuelidate'
import VModal from 'vue-js-modal'
import i18n from '@/plugins/internationalisation/i18n.js';
import JsonExcel from 'vue-json-excel'

import 'vue-good-table/dist/vue-good-table.css'
import "buefy/dist/buefy.css";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css' 
import "./styles/theme.scss"; // global css
 
// Resolve the dependencies
Vue.use(BootstrapVue)
Vue.use(Buefy);
Vue.use(Vuelidate);
Vue.use(VueGoodTablePlugin);
Vue.use(VModal)
Vue.component('downloadExcel', JsonExcel)

Vue.config.productionTip = false
axios.defaults.baseURL = 'https://back.saras.care'

Vue.config.productionTip = false;
new Vue({
	router,
	i18n,	
	store,
  	render: h => h(App)
}).$mount("#app");
