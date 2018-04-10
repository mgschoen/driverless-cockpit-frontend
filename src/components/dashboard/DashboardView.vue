<template>

  <div>
    <RecordingControls v-if="transportMode === 'live'"></RecordingControls>
    <ReplayControls v-if="transportMode === 'replay'"
                    v-on:reset-clip="resetClip"
                    clip-name="Nase"
                    :clip-length="80000"></ReplayControls>

    <b-row>
      <b-col>
        <Map />
      </b-col>
    </b-row>

    <b-row>
      <b-card-group columns>
        <b-card title="Live stats">
          <p class="card-text">
            <code>
              {
                "timestamp": 1521929473543,
                "steerAngle": -1,
                "pathMiddleX": 45.754,
                "pathMiddleY": -27.9,
                "vehicleX": 46.773,
                "vehicleY": -27.746,
                "vehicleVelocityX": 5.6766,
                "vehicleVelocityY": -0.92604,
                "vehicleRotation": -1.4526,
                "frontwheelLeftRotation": -0.37929,
                "frontwheelRightRotation": -0.40544
              }
            </code>
          </p>
        </b-card>
        <b-card title="Live stats">
          <p class="card-text">
            <code>
              {
              "timestamp": 1521929473543,
              "steerAngle": -1,
              "pathMiddleX": 45.754,
              "pathMiddleY": -27.9,
              "vehicleX": 46.773,
              "vehicleY": -27.746,
              "vehicleVelocityX": 5.6766,
              "vehicleVelocityY": -0.92604,
              "vehicleRotation": -1.4526,
              "frontwheelLeftRotation": -0.37929,
              "frontwheelRightRotation": -0.40544
              }
            </code>
          </p>
        </b-card>
        <b-card title="Live stats">
          <p class="card-text">
            <code>
              {
              "timestamp": 1521929473543,
              "steerAngle": -1,
              "pathMiddleX": 45.754,
              "pathMiddleY": -27.9,
              "vehicleX": 46.773,
              "vehicleY": -27.746,
              "vehicleVelocityX": 5.6766,
              "vehicleVelocityY": -0.92604,
              "vehicleRotation": -1.4526,
              "frontwheelLeftRotation": -0.37929,
              "frontwheelRightRotation": -0.40544
              }
            </code>
          </p>
        </b-card>
        <b-card title="Live stats">
          <p class="card-text">
            <code>
              {
              "timestamp": 1521929473543,
              "steerAngle": -1,
              "pathMiddleX": 45.754,
              "pathMiddleY": -27.9,
              "vehicleX": 46.773,
              "vehicleY": -27.746,
              "vehicleVelocityX": 5.6766,
              "vehicleVelocityY": -0.92604,
              "vehicleRotation": -1.4526,
              "frontwheelLeftRotation": -0.37929,
              "frontwheelRightRotation": -0.40544
              }
            </code>
          </p>
        </b-card>
        <b-card title="Live stats">
          <p class="card-text">
            <code>
              {
              "timestamp": 1521929473543,
              "steerAngle": -1,
              "pathMiddleX": 45.754,
              "pathMiddleY": -27.9,
              "vehicleX": 46.773,
              "vehicleY": -27.746,
              "vehicleVelocityX": 5.6766,
              "vehicleVelocityY": -0.92604,
              "vehicleRotation": -1.4526,
              "frontwheelLeftRotation": -0.37929,
              "frontwheelRightRotation": -0.40544
              }
            </code>
          </p>
        </b-card>
        <b-card title="Live stats">
          <p class="card-text">
            <code>
              {
              "timestamp": 1521929473543,
              "steerAngle": -1,
              "pathMiddleX": 45.754,
              "pathMiddleY": -27.9,
              "vehicleX": 46.773,
              "vehicleY": -27.746,
              "vehicleVelocityX": 5.6766,
              "vehicleVelocityY": -0.92604,
              "vehicleRotation": -1.4526,
              "frontwheelLeftRotation": -0.37929,
              "frontwheelRightRotation": -0.40544
              }
            </code>
          </p>
        </b-card>
      </b-card-group>
    </b-row>
  </div>
</template>

<script>
import RecordingControls from '@/components/dashboard/RecordingControls'
import ReplayControls from '@/components/dashboard/ReplayControls'
import Map from '@/components/dashboard/Map'

export default {
  name: 'DashboardView',
  data () {
    return {
      apiRoot: process.env.FSD_API_ROOT,
      // live || replay
      transportMode: 'replay',
      // idle || active
      transportState: 'idle',
      transportPosition: 0,
      activeClip: 'nase'
    }
  },
  components: {
    RecordingControls,
    ReplayControls,
    Map
  },
  methods: {
    resetClip: function () {
      this.transportState = 'idle'
      this.activeClip = null
      this.transportMode = 'live'
    }
  }
}
</script>
