<template>

  <div>
    <router-view name="transportControls"></router-view>

    <!--RecordingControls v-if="transportMode === 'live'"></RecordingControls>
    <ReplayControls v-if="transportMode === 'replay'"
                    v-on:reset-clip="resetClip"
                    clip-name="Nase"
                    :clip-length="80000"></ReplayControls-->

    <router-view name="map"></router-view>

    <!--Map /-->

    <router-view name="cards"></router-view>

  </div>
</template>

<script>
import RecordingControls from '@/components/RecordingControls'
import ReplayControls from '@/components/ReplayControls'
import Map from '@/components/Map'

export default {
  name: 'DashboardView',
  props: {
    recording: Boolean
  },
  data () {
    return {
      apiRoot: process.env.FSD_API_ROOT,
      transportMode: 'live', // live || replay
      transportPosition: 0,
      activeClip: null,

      liveStats: null,
      requiredProperties: [
        'timestamp', 'steerAngle', 'pathMiddleX', 'pathMiddleY', 'vehicleX', 'vehicleY', 'vehicleVelocityX',
        'vehicleVelocityY', 'vehicleRotation', 'frontwheelLeftRotation', 'frontwheelRightRotation']
    }
  },
  computed: {
    transportState: function () {
      let mode = this.transportMode
      if (mode === 'live' && this.recording) {
        return 'active'
      } else if (mode === 'live') {
        return 'idle'
      } else if (mode === 'replay') {
        return 'idle'
      }
    }
  },
  mounted: function () {
    this.updateStats()
  },
  methods: {
    resetClip: function () {
      this.transportState = 'idle'
      this.activeClip = null
      this.transportMode = 'live'
    },
    updateStats: function () {
      this.$http.get(this.apiRoot + 'livestats').then(response => {
        let responseBody = response.body
        let errorMessageStub = 'Missing property: '
        this.requiredProperties.forEach((prop) => {
          if (!responseBody.hasOwnProperty(prop)) {
            throw new Error(errorMessageStub + prop)
          }
        })

        this.liveStats = response.body
        window.setTimeout(this.updateStats, 100)
      }, error => {
        console.log(error)
      })
    }
  },
  components: {
    RecordingControls,
    ReplayControls,
    Map
  }
}
</script>
