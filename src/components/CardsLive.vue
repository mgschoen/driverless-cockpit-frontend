<template>
  <b-row>
    <b-card-group columns>
      <b-card title="Live stats">
        <p class="card-text">
          <pre>{{liveStatsFiltered}}</pre>
        </p>
      </b-card>
    </b-card-group>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CardsLive',
  data () {
    return {}
  },
  computed: mapState({
    liveStats: 'liveStats',
    liveStatsFiltered () {
      let originalObject = this.liveStats
      let filteredObject = {}
      for (var key in originalObject) {
        if (originalObject.requiredProperties.indexOf(key) >= 0) {
          filteredObject[key] = originalObject[key]
        }
      }
      return filteredObject
    }
  })
}
</script>
