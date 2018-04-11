<template>
  <b-row>
    <b-card-group columns>
      <b-card title="Live stats">
        <p class="card-text">
          <code>
            We are the live cards
            {{liveStats}}
          </code>
        </p>
      </b-card>
    </b-card-group>
  </b-row>
</template>

<script>
export default {
  name: 'CardsLive',
  props: {
    liveStats: Object
  },
  data () {
    return {}
  }
}
</script>
