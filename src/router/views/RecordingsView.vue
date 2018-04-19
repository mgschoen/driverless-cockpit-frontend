<template>
  <div>
    <b-row>
      <b-col>
        <h1>Select a clip to replay</h1>
      </b-col>
    </b-row>
    <b-row align-h="between">
      <b-col align-self="center">
        <b-progress :max="100"
                    height="20px"
                    variant="fsd-red"
                    v-if="loading"
                    animated>
          <b-progress-bar :value="100">
            <strong>Loading clips...</strong>
          </b-progress-bar>
        </b-progress>
      </b-col>
      <b-col cols="auto">
        <b-button variant="secondary" :disabled="loading" @click="reload">
          <img src="@/assets/loop-circular.svg" width="16">
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table :items="recordings"
                 :fields="fields"
                 id="clipList"
                 thead-class="thead-fsd"
                 tbody-class="tbody-fsd"
                 hover fixed>
          <span slot="_id" slot-scope="data">
            <router-link :to="'/dashboard/replay/' + data.value">{{data.value}}</router-link>
          </span>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Util from '@/shared/util'

export default {
  name: 'RecordingsView',
  data () {
    return {
      loading: false,
      fields: [
        {
          key: '_id',
          label: 'ID'
        },
        {
          key: 'start',
          label: 'Started at',
          formatter: (value, key, item) => {
            let date = new Date(value)
            let string =
              Util.padZeros(2, date.getDate()) + '.' +
              Util.padZeros(2, date.getMonth()) + '.' +
              date.getFullYear() + ' - ' +
              Util.padZeros(2, date.getHours()) + ':' +
              Util.padZeros(2, date.getMinutes()) + ':' +
              Util.padZeros(2, date.getSeconds())
            return string
          }
        },
        {
          key: 'duration',
          label: 'Duration',
          formatter: (value, key, item) => {
            if (item.end) {
              return Util.timerFormat(item.end - item.start)
            } else {
              return '- not finished -'
            }
          }
        }
      ]
    }
  },
  computed: mapState({
    recordings: 'recordings'
  }),
  mounted () {
    this.reload()
  },
  methods: {
    reload () {
      this.loading = true
      this.$store.dispatch('fetchRecordings').then(_ => {
        this.loading = false
      }, error => {
        console.log(error)
      })
    }
  }
}
</script>

<style>

  #clipList {
    margin-top: 30px;
  }

  .bg-fsd-red {
    background-color: var(--app-highlight-medium-color)
  }

  .thead-fsd {
    background-color: var(--app-primary-color);
    color: var(--app-lighttext-color);
  }

  .tbody-fsd {
    background-color: var(--app-background-color)
  }

  .tbody-fsd td {
    border-top: 1px solid var(--app-primary-light-color);
    overflow: hidden;
  }

</style>
