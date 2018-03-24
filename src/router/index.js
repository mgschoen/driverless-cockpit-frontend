import Vue from 'vue'
import Router from 'vue-router'
import DashboardView from '@/components/dashboard/DashboardView'
import RecordingsView from '@/components/recordings/RecordingsView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/recordings',
      name: 'recordings',
      component: RecordingsView
    }
  ]
})
