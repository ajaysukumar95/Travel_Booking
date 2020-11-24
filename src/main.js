import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import moment from 'moment'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.prototype.moment = moment;
Vue.use(require('vue-moment'));
export const bus = new Vue();

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
