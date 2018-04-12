// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueResource from 'vue-resource'

import router from './router'
import App from './App'
import store from '@/store/store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import '@/shared/shared-styles.scss'

Vue.config.productionTip = false

// Plugins
Vue.use(BootstrapVue)
Vue.use(VueResource)

// HTTP configuration
Vue.http.options.root = process.env.FSD_API_ROOT

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
