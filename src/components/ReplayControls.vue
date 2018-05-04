<template>
  <div>
    <b-row>
      <b-col sm="auto">
        <p>Replay clip: <code>{{clipID}}</code></p>
      </b-col>
    </b-row>
    <b-row align-h="start">

      <!-- Control buttons -->
      <b-col order="0" cols="auto">
        <b-button-group>
          <!-- play button -->
          <b-button :pressed="replayGlobals.mode === 'playing'"
                    @click="play">
            <img src="@/assets/play.svg">
          </b-button>
          <!-- pause button -->
          <b-button :disabled="replayGlobals.mode !== 'playing'"
                    @click="pause">
            <span class="panelIcon pause"></span>
          </b-button>
          <!-- stop button -->
          <b-button :disabled="position === 0"
                    @click="stop">
            <span class="panelIcon stop"></span>
          </b-button>
        </b-button-group>
      </b-col>

      <!-- Counter -->
      <b-col order="1" class="p-0" col sm="auto">
        <code class="button-indent">
          {{counterValue}}
        </code>
      </b-col>

      <!-- Slider -->
      <b-col order="3" order-sm="2" cols="12" sm>
        <vue-slider v-model="position"
                    v-bind="sliderOptions"
                    :formatter="counterValue"
                    class="tape"></vue-slider>
      </b-col>

      <!-- Close button -->
      <b-col order="2" order-sm="3" cols="3" sm="auto" class="pl-0">
        <b-button variant="secondary" to="/dashboard/live">
          <img src="@/assets/x.svg">
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import vueSlider from 'vue-slider-component'
import Util from '@/shared/util.js'

export default {
  name: 'ReplayControls',
  props: {
    clipID: String
  },
  data () {
    return {
      lastTickAt: 0,
      position: 0,
      sliderOptions: {
        tooltip: 'hover',
        processStyle: {
          backgroundColor: 'rgba(190,22,33,1)'
        },
        tooltipStyle: {
          backgroundColor: 'rgba(50,50,50,1)',
          borderColor: 'rgba(50,50,50,1)'
        },
        max: 100
      }
    }
  },
  computed: mapState({
    replayGlobals: 'replay',
    counterValue: function () {
      return Util.timerFormat(this.position)
    }
  }),
  watch: {
    position: function (newPosition, oldPosition) {
      this.$store.commit('updateReplayDelta', newPosition - oldPosition)
      this.$store.commit('updateReplayRecordingActiveFrame', newPosition)
    }
  },
  mounted () {
    this.$store.commit('updateGlobalLoader', {show: true, message: 'Loading clip...'})
    this.position = 0
    this.$store.dispatch('fetchReplayRecording', this.clipID).then(_ => {
      let recording = this.replayGlobals.selectedRecording
      this.sliderOptions.max = recording.end - recording.start
      this.$store.commit('updateReplayRecordingActiveFrame', this.position)
      this.$store.commit('updateGlobalLoader', {show: false, message: ''})
    }, error => {
      console.log(error)
    })
  },
  methods: {
    playTick: function () {
      switch (this.replayGlobals.mode) {
        case 'playing':
          let now = new Date().getTime()
          let timeElapsed = this.lastTickAt ? now - this.lastTickAt : 0
          if (timeElapsed < (this.sliderOptions.max - this.position)) {
            this.position += timeElapsed
            this.lastTickAt = now
            window.setTimeout(this.playTick, 100)
          } else {
            this.pause()
            this.position = this.sliderOptions.max
          }
          break
        case 'paused':
          this.lastTickAt = 0
          break
        case 'stopped':
        default:
          // do nothing
      }
    },
    play: function () {
      if (this.replayGlobals.mode !== 'playing') {
        this.$store.commit('updateReplayMode', 'playing')
        this.playTick()
      }
    },
    pause: function () {
      if (this.replayGlobals.mode === 'playing') {
        this.$store.commit('updateReplayMode', 'paused')
      }
    },
    stop: function () {
      if (this.position !== 0) {
        this.$store.commit('updateReplayMode', 'stopped')
        this.position = 0
        this.lastTickAt = 0
      }
    }
  },
  components: {
    vueSlider
  }
}
</script>

<style scoped>
  .panelIcon {
    display: inline-block;
    width: 12px;
    height: 12px;
  }
  .pause {
    border-left: 4px solid lightgray;
    border-right: 4px solid lightgray;
  }
  .stop {
    background: lightgray;
    border-radius: 2px;
  }
  .tape {
    margin-top: 7px;
  }
</style>
