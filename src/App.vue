<template>
  <div id="app">

    <b-navbar toggleable="md" type="dark" variant="fsd">

      <b-navbar-toggle target="navbarCollapse"></b-navbar-toggle>

      <b-navbar-brand href="/#/">Driverless Cockpit</b-navbar-brand>

      <b-collapse is-nav id="navbarCollapse">

        <b-navbar-nav>
          <b-nav-item to="/recordings">
            <b-button variant="primary" size="sm">
              <img src="@/assets/play-white.svg" width="10" class="replay-icon"> Replay
            </b-button>
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item>
            <connected-status :active="appState.connected"/>
          </b-nav-item>
        </b-navbar-nav>

      </b-collapse>

    </b-navbar>

    <b-container>

      <router-view/>

    </b-container>
  </div>
</template>

<script>
import ConnectedStatus from '@/components/ConnectedStatus'
import Util from '@/shared/util.js'

export default {
  name: 'App',
  data () {
    return {
      apiRoot: process.env.FSD_API_ROOT,
      requiredProperties: ['connected', 'recording'],
      appState: {
        connected: false,
        recording: false
      }
    }
  },
  mounted: function () {
    this.updateAppState()
  },
  methods: {
    updateAppState: function () {
      this.$http.get(this.apiRoot + 'appstate').then(response => {
        let responseBody = response.body
        let responseValidation = Util.validateObjectSchema(responseBody, this.requiredProperties)
        if (responseValidation.valid) {
          this.appState = responseBody
        } else {
          throw new Error('Missing properties: ' + responseValidation.missing.toString())
        }
      }, error => {
        console.log(error)
      })
    }
  },
  components: {
    ConnectedStatus
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--app-primary-color);
}
/* Used for <b-navbar variant="fsd"> */
.bg-fsd {
  background-color: var(--app-primary-color);
}
/* Used for <b-container> */
.container {
  margin-top: 20px;
}
.replay-icon {
  margin-bottom: 4px;
}
</style>
