<template>
  <b-row>
    <b-col md="6" lg="4">
      <b-card title="Live stats">
        <p class="card-text">
        <pre>
timestamp: {{liveStatsFiltered.timestamp}}
steerAngle: {{liveStatsFiltered.steerAngle}}
pathMiddleX: {{liveStatsFiltered.pathMiddleX}}
pathMiddleY: {{liveStatsFiltered.pathMiddleY}}
vehicleX: {{liveStatsFiltered.vehicleX}}
vehicleY: {{liveStatsFiltered.vehicleY}}
vehicleVelocityX: {{liveStatsFiltered.vehicleVelocityX}}
vehicleVelocityY: {{liveStatsFiltered.vehicleVelocityY}}
vehicleRotation: {{liveStatsFiltered.vehicleRotation}}
frontwheelLeftRotation: {{liveStatsFiltered.frontwheelLeftRotation}}
frontwheelRightRotation: {{liveStatsFiltered.frontwheelRightRotation}}
        </pre>
        </p>
      </b-card>
    </b-col>
    <b-col md="6" lg="4">
      <b-card title="Observations">
        <p class="card-text">
        <pre>{{liveStatsFiltered.observations}}</pre>
        </p>
      </b-card>
    </b-col>
    <b-col md="6" lg="4">
      <b-card title="Clusters">
        <p class="card-text">
        <!--pre>{{liveStatsFiltered.clusters}}</pre-->
        </p>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'
import StoreUtil from '@/store/store-util'

export default {
  name: 'CardsLive',
  data () {
    return {}
  },
  computed: mapState({
    liveStats: 'liveStats',
    liveStatsFiltered () {
      let requiredProperties = StoreUtil.getConfigFromIdentifier('liveStats').requiredProperties
      let originalObject = this.liveStats
      let filteredObject = {}
      for (var key in originalObject) {
        if (requiredProperties.indexOf(key) >= 0) {
          filteredObject[key] = originalObject[key]
        }
      }
      return filteredObject
    }
  })
}
</script>
