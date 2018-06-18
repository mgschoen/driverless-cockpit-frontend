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
import { timerFormat } from '@/shared/util'

export default {
  name: 'Plot',
  props: {
    'id': Number
  },
  data () {
    return {
      plotParameters: ['steerAngle', 'vehicleRotation', 'vehicleX', 'vehicleY', 'vehicleVelocityX',
        'vehicleVelocityY', 'vehicleAccelerationX', 'vehicleAccelerationY'],
      selectedParameter: null,

      // animation
      markLineInterval: null,
      lastKnownTimestamp: null
    }
  },
  computed: mapState({
    replayGlobals: 'replay'
  }),
  mounted () {
    let _that = this
    let formatter = function (value) {
      let displayValue = value - _that.replayGlobals.selectedRecording.start
      return timerFormat(displayValue)
    }
    let tooltipFormatter = function (series) {
      let timeString = formatter(series[0].value[0])
      return `${timeString}<br />${_that.selectedParameter}: ${series[0].value[1]}`
    }
    this.chart = echarts.init(this.$el.querySelector('.chart'))
    var option = {
      tooltip: {
        trigger: 'axis',
        formatter: tooltipFormatter
      },
      dataZoom: [{
        type: 'slider',
        labelFormatter: formatter
      }, {
        type: 'inside'
      }],
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: formatter
        }
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

    this.markLineInterval = setInterval(this.markLineAnimationTick, 500)
  },
  beforeDestroy () {
    console.log('beforeDestroy')
    clearInterval(this.markLineInterval)
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
                xAxis: this.replayGlobals.activeFrame.timestamp,
                label: {
                  show: false,
                  emphasis: {
                    show: false
                  }
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
    },
    markLineAnimationTick () {
      let ts = this.replayGlobals.activeFrame.timestamp
      if (ts !== this.lastKnownTimestamp) {
        this.lastKnownTimestamp = ts
        let option = this.chart.getOption()
        let lineData = null
        try {
          lineData = option.series[0].markLine.data[0]
        } catch (e) {}
        if (lineData) {
          lineData.xAxis = this.replayGlobals.activeFrame.timestamp
          this.chart.setOption({series: [{markLine: {data: [lineData]}}]})
        }
      }
    }
  }
}
</script>

<style scoped>
  .chart {
    width: 100%;
    height: 250px;
  }
</style>
