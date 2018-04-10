<template>
  <div>
    <b-row>
      <b-col sm="auto">
        <p>Replay clip: <code>{{clipName}}</code></p>
      </b-col>
    </b-row>
    <b-row align-h="start">

      <!-- Control buttons -->
      <b-col order="0" cols="auto">
        <b-button-group>
          <!-- play button -->
          <b-button :pressed="playing"
                    @click="play">
            <img src="@/assets/play.svg">
          </b-button>
          <!-- pause button -->
          <b-button :disabled="!playing"
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
        <b-button @click="$emit('reset-clip')">
          <img src="@/assets/x.svg">
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import util from '@/shared/util.js'

export default {
  name: 'ReplayControls',
  components: {
    vueSlider
  },
  props: {
    clipName: String,
    clipLength: Number
  },
  data () {
    return {
      playing: false,
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
        max: this.clipLength
      }
    }
  },
  computed: {
    counterValue: function () {
      let minutes = Math.floor(this.position / 60000)
      let seconds = Math.floor((this.position % 60000) / 1000)
      let msecs = this.position % 1000
      return util.padZeros(2, minutes) + ':' +
             util.padZeros(2, seconds) + ':' +
             util.padZeros(3, msecs)
    }
  },
  methods: {
    play: function () {
      if (!this.playing) {
        this.playing = true
      }
    },
    pause: function () {
      if (this.playing) {
        this.playing = false
      }
    },
    stop: function () {
      if (this.position !== 0) {
        this.playing = false
        this.position = 0
      }
    }
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
