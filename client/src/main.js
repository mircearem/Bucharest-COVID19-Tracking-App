import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import MdDatepicker from 'vue-material/dist/components/MdDatepicker';
// import MdButton from 'vue-material/dist/components/MdButton';
// import MdCheckbox from 'vue-material/dist/components/MdCheckbox'; 
// import MdDialog from 'vue-material/dist/components/MdDialog';
// import MdTabs from 'vue-material/dist/components/MdTabs';
// import MdProgressBar from 'vue-material/dist/components/MdProgress';
// import MdField from 'vue-material/dist/components/MdField';

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

// Vue.use(MdButton);
// Vue.use(MdDatepicker);
// Vue.use(MdCheckbox);
// Vue.use(MdDialog);
// Vue.use(MdTabs);
// Vue.use(MdProgressBar);
Vue.use(VueMaterial);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
