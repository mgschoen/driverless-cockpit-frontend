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
    return {
      clipPosition: 0
    }
  },
  computed: mapState({
    appState: 'appState',
    counterValue: function () {
      return Util.timerFormat(this.clipPosition)
    }
  }),
  methods: {
    record: function () {
      if (!this.recording) {
        this.recording = true
      }
    },
    stop: function () {
      if (this.recording) {
        this.recording = false
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
