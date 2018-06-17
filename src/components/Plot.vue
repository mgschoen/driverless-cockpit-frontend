<template>
  <b-card title="Stats" style="width: 100%;">
    <b-form-select v-model="selectedParameter" :options="plotParameters" @change="updateChart">
      <option :value="null">Select parameter</option>
    </b-form-select>
    <div class="chart"></div>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import echarts from 'echarts'

export default {
  name: 'Plot',
  data () {
    return {
      plotParameters: ['steerAngle', 'vehicleRotation', 'vehicleX', 'vehicleY', 'vehicleVelocityX',
        'vehicleVelocityY', 'vehicleAccelerationX', 'vehicleAccelerationY'],
      selectedParameter: null
    }
  },
  computed: mapState({
    replayGlobals: 'replay'
  }),
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

    // use configuration item and data specified to show chart
    this.chart.setOption(option)
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
          data: data
        }]
      })
    }
  }
}
</script>

<style scoped>
  .chart {
    width: 100%;
    min-width: 400px;
    height: 400px;
  }
</style>
