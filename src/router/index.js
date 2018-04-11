import Vue from 'vue'
import Router from 'vue-router'
import DashboardView from '@/router/views/DashboardView'
import RecordingsView from '@/router/views/RecordingsView'
import RecordingControls from '@/components/RecordingControls'
import ReplayControls from '@/components/ReplayControls'
import Map from '@/components/Map'
import CardsLive from '@/components/CardsLive'
import CardsReplay from '@/components/CardsReplay'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard/live'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      props: {
        recording: true
      },
      children: [
        {
          path: 'live',
          components: {
            transportControls: RecordingControls,
            map: Map,
            cards: CardsLive
          }
        },
        {
          path: 'replay/:clipID',
          components: {
            transportControls: ReplayControls,
            map: Map,
            cards: CardsReplay
          },
          props: { transportControls: true }
        }
      ]
    },
    {
      path: '/recordings',
      name: 'recordings',
      component: RecordingsView
    }
  ]
})
