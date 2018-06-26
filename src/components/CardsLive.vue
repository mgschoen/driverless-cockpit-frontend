<template>
  <b-row>
    <b-col md="6" lg="4">
      <b-card title="Live stats">
        <p class="card-text">
        <pre>
timestamp: {{liveStatsFiltered.timestamp}}
steerAngle: {{liveStatsFiltered.steerAngle}}
vehicleX: {{liveStatsFiltered.vehicleX}}
vehicleY: {{liveStatsFiltered.vehicleY}}
vehicleVelocityX: {{liveStatsFiltered.vehicleVelocityX}}
vehicleVelocityY: {{liveStatsFiltered.vehicleVelocityY}}
vehicleAccelerationX: {{liveStatsFiltered.vehicleAccelerationX}}
vehicleAccelerationY: {{liveStatsFiltered.vehicleAccelerationY}}
vehicleRotation: {{liveStatsFiltered.vehicleRotation}}
        </pre>
        </p>
      </b-card>
    </b-col>
    <!-- These are for debugging only -->
    <b-col md="6" lg="4">
      <!--b-card-- title="Base Case">
        <p class="card-text">
        <pre>{{liveStatsFiltered.basecaseMiddlePoints}}</pre>
        </p>
      </b-card-->
    </b-col>
    <b-col md="6" lg="4">
      <!--b-card title="Trajectory">
        <p class="card-text">
          <pre>{{liveStatsFiltered.trajectory}}</pre>
          <pre>{{liveStatsFiltered.clusters}}</pre>
        </p>
      </b-card-->
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
