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
          <b-nav-item to="/dashboard/live">
            <status-light label="Recording"
                          :active="appState.recording"
                          color="rgba(190,22,33,1)"></status-light>
          </b-nav-item>
          <b-nav-item>
            <status-light label="Connected"
                          :active="appState.connected"
                          color="lightgreen"/>
          </b-nav-item>
        </b-navbar-nav>

      </b-collapse>

    </b-navbar>

    <b-container>

      <router-view/>

    </b-container>

    <b-modal ref="globalLoader"
             v-model="globalLoader.show"
             no-close-on-esc
             no-close-on-backdrop
             hide-header-close>
      <div slot="modal-header"></div>
      <h3>{{globalLoader.message}}</h3>
      <div slot="modal-footer"></div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StatusLight from '@/components/StatusLight'

export default {
  name: 'App',
  data () {
    return {}
  },
  computed: mapState({
    appState: 'appState',
    globalLoader: 'globalLoader'
  }),
  created: function () {
    this.$store.dispatch('startRefreshingEntity', 'appState')
  },
  components: {
    StatusLight
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
