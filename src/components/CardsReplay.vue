<template>
  <b-row style="margin-bottom: 50px;">
    <b-card-group style="width:100%;" ref="plotContainer">
      <Plot v-for="p in plots" :key="p" :id="p" @delete-plot="deletePlot"></Plot>
      <div class="w-50 px-3 pb-4 d-flex align-items-center justify-content-center plus-button-container">
        <b-button @click="addPlot">
          <img src="@/assets/plus.svg" width="50" class="plus-sign">
          <label>Add plot</label>
        </b-button>
      </div>
    </b-card-group>
  </b-row>
</template>

<script>
import Plot from '@/components/Plot'

export default {
  name: 'CardsReplay',
  data () {
    return {
      plots: []
    }
  },
  methods: {
    addPlot: function () {
      let key = new Date().getTime()
      this.plots.push(key)
    },
    deletePlot: function (key) {
      let index = this.plots.indexOf(key)
      if (index >= 0) {
        this.plots.splice(index, 1)
      }
    }
  },
  components: {
    Plot
  }
}
</script>

<style scoped>
.plus-button-container {
  min-height: 250px;
}
.plus-sign {
  margin: 10px;
}
</style>
