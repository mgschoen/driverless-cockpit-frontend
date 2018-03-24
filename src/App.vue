<template>
  <div id="app">

    <b-navbar toggleable="md" type="dark" variant="fsd">

      <b-navbar-toggle target="navbarCollapse"></b-navbar-toggle>

      <b-navbar-brand href="/#/">Driverless Cockpit</b-navbar-brand>

      <b-collapse is-nav id="navbarCollapse">

        <b-navbar-nav>
          <b-nav-item to="/dashboard" :active="$route.name === 'dashboard'">
            Live
          </b-nav-item>
          <b-nav-item to="/recordings" :active="$route.name === 'recordings'">
            Recordings
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item>
            <connected-status active/>
          </b-nav-item>
        </b-navbar-nav>

      </b-collapse>

    </b-navbar>

    <b-container fluid>

      <router-view/>

    </b-container>
  </div>
</template>

<script>
import ConnectedStatus from '@/components/ConnectedStatus'

export default {
  name: 'App',
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
  color: #2c3e50;
}
.bg-fsd {
  background-color: var(--app-primary-color);
}
</style>
