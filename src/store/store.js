import Vue from 'vue'
import Vuex from 'vuex'
import Util from '@/shared/util'
import StoreUtil from '@/store/store-util'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiRoot: process.env.FSD_API_ROOT,
    appState: {
      requiredProperties: ['activeRecording', 'connected', 'recording'],
      refresh: false,
      refreshInterval: 500,
      activeRecording: null,
      connected: false,
      recording: false
    },
    liveStats: {
      requiredProperties: ['timestamp', 'steerAngle', 'pathMiddleX', 'pathMiddleY', 'vehicleX',
        'vehicleY', 'vehicleVelocityX', 'vehicleVelocityY', 'vehicleRotation', 'frontwheelLeftRotation',
        'frontwheelRightRotation'],
      refresh: false,
      refreshInterval: 100,
      timestamp: 0,
      steerAngle: 0,
      pathMiddleX: 0,
      pathMiddleY: 0,
      vehicleX: 0,
      vehicleY: 0,
      vehicleVelocityX: 0,
      vehicleVelocityY: 0,
      vehicleRotation: 0,
      frontwheelLeftRotation: 0,
      frontwheelRightRotation: 0
    },
    viewState: {
      replayModes: ['playing', 'paused', 'stopped'],
      replayMode: 'stopped'
    }
  },
  mutations: {
    updateEntity (state, options) {
      let stateObject = StoreUtil.getStateObjectFromIdentifier(state, options.entityIdentifier)
      for (var key in options.payload) {
        if (stateObject.hasOwnProperty(key)) {
          stateObject[key] = options.payload[key]
        }
      }
    }
  },
  actions: {
    /* The following actions are abstractions for fetching entities (i.e. objects) from the API in
     * a continuous fashion. The entities need to be represented as objects within the state.
     * The state objects are required to have additional meta properties:
     *   - requiredProperties {Array}: property keys that the API is expected to return
     *   - refresh {Boolean}: whether the entity is in refresh mode or not
     *   - refreshInterval {Number}: number of milliseconds to wait before the next refresh
     * Caveat: Only properties that are declared in the initial state are stored. If the API returns
     *         properties that are not declared, they are ignored. */
    startRefreshingEntity (context, entityIdentifier) {
      let stateObject = StoreUtil.getStateObjectFromIdentifier(context.state, entityIdentifier)
      if (!stateObject.refresh) {
        stateObject.refresh = true
        context.dispatch('entityRefreshTick', entityIdentifier)
      }
    },
    stopRefreshingEntity (context, entityIdentifier) {
      let stateObject = StoreUtil.getStateObjectFromIdentifier(context.state, entityIdentifier)
      stateObject.refresh = false
    },
    entityRefreshTick (context, entityIdentifier) {
      let stateObject = StoreUtil.getStateObjectFromIdentifier(context.state, entityIdentifier)
      let apiRoute = StoreUtil.getApiRouteFromIdentifier(entityIdentifier)
      Vue.http.get(apiRoute).then(response => {
        let responseBody = response.body
        let responseValidation = Util.validateObjectSchema(responseBody, stateObject.requiredProperties)
        if (responseValidation.valid) {
          context.commit('updateEntity', {
            entityIdentifier: entityIdentifier,
            payload: responseBody
          })
          if (stateObject.refresh) {
            window.setTimeout(_ => {
              context.dispatch('entityRefreshTick', entityIdentifier)
            }, stateObject.refreshInterval)
          }
        } else {
          console.log(new Error('Missing properties: ' + responseValidation.missing.toString()))
        }
      }, error => {
        console.log(error)
      })
    }
  }
})
