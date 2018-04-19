<template>
  <b-row>
    <b-card-group columns>
      <b-card title="Stats">
        <p class="card-text">
          <code>
            {{replayGlobals.activeFrame}}
          </code>
        </p>
      </b-card>
    </b-card-group>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CardsReplay',
  data () {
    return {}
  },
  computed: mapState({
    replayGlobals: 'replay'
  })
}
</script>
