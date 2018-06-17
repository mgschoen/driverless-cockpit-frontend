<template>
  <div class="w-50 px-3 pb-4">
    <b-card class="m-0" style="width: 100%;">
      <b-row>
        <b-col>
          <b-form-select v-model="selectedParameter" :options="plotParameters" @change="updateChart">
            <option :value="null">Select parameter</option>
          </b-form-select>
        </b-col>
        <b-col cols="auto">
          <b-button @click="fireDelete">
            <img src="@/assets/trash.svg" width="14">
          </b-button>
        </b-col>
      </b-row>
      <div class="chart"></div>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import echarts from 'echarts'

export default {
  name: 'Plot',
  props: {
    'id': Number
  },
  data () {
    return {
      plotParameters: ['steerAngle', 'vehicleRotation', 'vehicleX', 'vehicleY', 'vehicleVelocityX',
        'vehicleVelocityY', 'vehicleAccelerationX', 'vehicleAccelerationY'],
      selectedParameter: null
    }
  },
  computed: {
    activeTimestamp: function () {
      return this.replayGlobals.activeFrame.timestamp
    },
    ...mapState({
      replayGlobals: 'replay'
    })
  },
  mounted () {
    this.chart = echarts.init(this.$el.querySelector('.chart'))
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      dataZoom: [{
        type: 'slider'
      }, {
        type: 'inside'
      }],
      xAxis: {
        type: 'time'
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'value',
        type: 'line',
        data: []
      }]
    }
    this.chart.setOption(option)

    // initialise chart resizing
    window.addEventListener('load', this.resizeChart)
    window.addEventListener('resize', this.resizeChart)
  },
  methods: {
    updateChart (newValue) {
      let data = []
      if (newValue) {
        data = this.replayGlobals.selectedRecording.frames.map(frame => {
          return {
            name: frame.timestamp.toString(),
            value: [frame.timestamp, frame[newValue]]
          }
        })
      }
      this.chart.setOption({
        series: [{
          name: 'value',
          data: data,
          markLine: {
            data: [
              {
                name: 'head',
                xAxis: this.activeTimestamp,
                label: {
                  show: false
                },
                symbolSize: 5
              }
            ]
          }
        }]
      })
    },
    resizeChart () {
      this.chart.resize()
    },
    fireDelete () {
      this.$emit('delete-plot', this.id)
    }
  }
}
</script>

<style scoped>
  .chart {
    width: 100%;
    /*min-width: 400px;*/
    height: 250px;
  }
</style>
