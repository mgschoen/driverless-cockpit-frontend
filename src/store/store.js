import Vue from 'vue'
import Vuex from 'vuex'
import Mutations from '@/store/mutations'
import Actions from '@/store/actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiRoot: process.env.FSD_API_ROOT,
    appState: {
      refresh: false,
      activeRecording: null,
      connected: false,
      recording: false,
      presentationMode: false
    },
    liveStats: {
      refresh: false,
      timestamp: 0,
      steerAngle: 0,
      pathMiddleX: 0,
      pathMiddleY: 0,
      vehicleX: 0,
      vehicleY: 0,
      vehicleVelocityX: 0,
      vehicleVelocityY: 0,
      vehicleAccelerationX: 0,
      vehicleAccelerationY: 0,
      vehicleRotation: 0,
      observations: [],
      clusters: {},
      trajectoryPrimitives: [],
      trajectoryHash: 0,
      trajectory: []
    },
    replay: {
      mode: 'stopped',
      delta: 0,
      selectedRecording: null,
      activeFrame: null
    },
    recordings: [],
    globalLoader: {
      show: false,
      message: 'Loading...'
    },
    viewDataSource: 'live'
  },
  mutations: Mutations,
  actions: Actions
})
