import Vue from 'vue'
import Util from '@/shared/util'
import StoreUtil from '@/store/store-util'

export default {
  fetchRecordings (context) {
    return new Promise((resolve, reject) => {
      Vue.http.get('recordings').then(response => {
        context.commit('updateRecordings', response.body)
        resolve()
      }, error => {
        reject(error)
      })
    })
  },

  fetchReplayRecording (context, id) {
    return new Promise((resolve, reject) => {
      Vue.http.get('recording/' + id).then(response => {
        context.commit('updateReplayRecording', response.body)
        resolve()
      }, error => {
        reject(error)
      })
    })
  },

  switchRecordingStatus (context, statusIdentifier) {
    return new Promise((resolve, reject) => {
      let apiRoute = StoreUtil.getApiRouteFromIdentifier(statusIdentifier)
      Vue.http.get(apiRoute).then(response => {
        context.commit('updateEntity', {
          entityIdentifier: 'appState',
          payload: response.body
        })
        resolve()
      }, error => {
        reject(error)
      })
    })
  },

  /* The following actions are abstractions for fetching entities (i.e. objects) from the API in
   * a continuous fashion. The entities need to be represented as objects within the state.
   * The state objects are required to have an additional property:
   *   - refresh {Boolean}: whether the entity is in refresh mode or not
   * Configuration has to be added to `CONFIG` object in `store-util.js`
   *   - requiredProperties {Array}: property keys that the API is expected to return
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
    let config = StoreUtil.getConfigFromIdentifier(entityIdentifier)
    let stateObject = StoreUtil.getStateObjectFromIdentifier(context.state, entityIdentifier)
    let apiRoute = StoreUtil.getApiRouteFromIdentifier(entityIdentifier)
    Vue.http.get(apiRoute).then(response => {
      let responseBody = response.body
      let responseValidation = Util.validateObjectSchema(responseBody, config.requiredProperties)
      if (responseValidation.valid) {
        context.commit('updateEntity', {
          entityIdentifier: entityIdentifier,
          payload: responseBody
        })
        if (stateObject.refresh) {
          window.setTimeout(_ => {
            context.dispatch('entityRefreshTick', entityIdentifier)
          }, config.refreshInterval)
        }
      } else {
        console.log(new Error('Missing properties: ' + responseValidation.missing.toString()))
      }
    }, error => {
      console.log(error)
    })
  }
}
