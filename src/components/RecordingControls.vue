<template>
  <b-row align-h="end">
    <b-col cols="auto" class="pr-0" v-if="appState.recording">
      <code class="button-indent">{{counterValue}}</code>
    </b-col>
    <b-col cols="auto">
      <b-button-group>
        <!-- stop button -->
        <b-button :disabled="!appState.recording"
                  @click="stop">
          <span class="panelIcon stop"></span>
        </b-button>
        <!-- record button -->
        <b-button :pressed="appState.recording"
                  @click="record">
          <span class="panelIcon record"></span>
        </b-button>
      </b-button-group>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'
import Util from '@/shared/util.js'

export default {
  name: 'RecordingControls',
  data () {
    return {}
  },
  computed: mapState({
    appState: 'appState',
    clipPosition: function () {
      if (this.appState && this.appState.recording) {
        let now = new Date().getTime()
        return now - this.appState.activeRecording.start
      }
      return 0
    },
    counterValue: function () {
      return Util.timerFormat(this.clipPosition)
    }
  }),
  methods: {
    record: function () {
      if (!this.appState.recording) {
        this.$store.dispatch('switchRecordingStatus', 'start').then(null, error => {
          console.log(error)
        })
      }
    },
    stop: function () {
      if (this.appState.recording) {
        this.$store.dispatch('switchRecordingStatus', 'stop').then(_ => {
          this.$router.push('/recordings')
        }, error => {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>
  @keyframes flash {
    0% {
      background-color: darkred;
    }
    50% {
      background-color: red;
    }
    100% {
      background-color: darkred;
    }
  }
  .panelIcon {
    display: inline-block;
    width: 12px;
    height: 12px;
  }
  .stop {
    background: lightgray;
    border-radius: 2px;
  }
  .record {
    border-radius:6px;
    background: darkred;
  }
  .active .panelIcon.record {
    animation: 1s ease-in infinite flash;
  }
</style>
