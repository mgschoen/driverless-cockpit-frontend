<template>
  <div>
    <router-view name="transportControls"></router-view>
    <router-view name="map"></router-view>
    <router-view name="cards"></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import RecordingControls from '@/components/RecordingControls'
import ReplayControls from '@/components/ReplayControls'
import Map from '@/components/Map'

export default {
  name: 'DashboardView',
  data () {
    return {
      transportMode: 'live', // live || replay
      transportPosition: 0,
      activeClip: null
    }
  },
  computed: mapState({
    liveStats: 'liveStats'
  }),
  watch: {
    $route (to, from) {
      if (to.path.split('/').indexOf('live') >= 0) {
        this.$store.dispatch('startRefreshingEntity', 'liveStats')
      }
    }
  },
  created: function () {
    if (this.$route.path.split('/').indexOf('live') >= 0) {
      this.$store.dispatch('startRefreshingEntity', 'liveStats')
    }
  },
  destroyed: function () {
    this.$store.dispatch('stopRefreshingEntity', 'liveStats')
  },
  components: {
    RecordingControls,
    ReplayControls,
    Map
  }
}
</script>
