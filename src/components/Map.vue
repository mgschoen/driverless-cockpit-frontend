<template>
  <div>
    <b-row>
      <b-col>
        <div id="mapWrapper"></div>
      </b-col>
    </b-row>
    <b-row class="mapControls" align-h="center">
      <b-col cols="auto" sm="auto" class="controlsCol">
        <div class="controlsFrame">
          <switches v-model="showGrid"
                    theme="fsd"
                    label="Show Grid"></switches>
        </div>
      </b-col>
      <b-col cols="auto" sm="auto" class="controlsCol">
        <div class="controlsFrame">
          <label>Zoom Level</label>
          <code>{{zoomLevel}}</code>
        </div>
      </b-col>
      <b-col cols="auto" sm="auto" class="controlsCol">
        <div class="controlsFrame">
          <switches v-model="focusVehicle"
                    theme="fsd"
                    label="Focus Vehicle"></switches>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// Libraries
import { mapState } from 'vuex'
import Konva from 'konva'
import Switches from 'vue-switches'

// Custom imports
import { meterToPixels } from '@/shared/util'
import ViewZoom from './mixins/view-zoom'
import ViewAnimation from './mixins/view-animation'

export default {
  name: 'Map',
  data () {
    return {
      // program logic internals
      lastKnownVehiclePosition: { x: 0, y: 0 },
      dataSource: 'live',

      // render objects
      stage: null,

      gridLayer: null,
      shapeGrid: null,
      shapeXAxis: null,
      shapeYAxis: null,

      vehicleLayer: null,
      shapeVehicle: null,

      // animations
      animationStage: null,
      animationVehicle: null,
      animationTrack: null,
      animationMiddlePath: null,

      // view parameters
      zoomStep: 1.1,
      minZoomScale: 0.15,
      maxZoomScale: 5.0,
      zoomLevel: 1.00,

      // view controls
      showVehicle: true,
      showTrack: true,
      showMiddlePath: true,
      showGrid: false,
      focusVehicle: true
    }
  },
  computed: {
    ...mapState([
      'liveStats',
      'replay',
      'viewDataSource'
    ])
  },
  watch: {
    focusVehicle: function (newValue) {
      if (this.animationStage) {
        if (newValue) {
          this.animationStage.start()
        } else {
          this.animationStage.stop()
        }
      }
    },
    showGrid: function (newValue) {
      if (this.gridLayer) {
        if (newValue) {
          this.gridLayer.show()
        } else {
          this.gridLayer.hide()
        }
      }
    }
  },
  mounted () {
    // Initialise Konva app
    let canvas = this.$el.querySelector('#mapWrapper')
    this.stage = new Konva.Stage({
      container: 'mapWrapper',
      draggable: true,
      width: canvas.offsetWidth,
      height: 500
    })

    // create layers
    this.gridLayer = new Konva.Layer()
    this.vehicleLayer = new Konva.Layer()
    this.stage.add(this.gridLayer)
    this.stage.add(this.vehicleLayer)

    if (!this.showGrid) {
      this.gridLayer.hide()
    }

    // draw coordinate axes
    this.shapeXAxis = new Konva.Line({
      points: [0, 2000, 0, -2000],
      stroke: 'red',
      strokeWidth: 3
    })
    this.shapeYAxis = new Konva.Line({
      points: [2000, 0, -2000, 0],
      stroke: 'green',
      strokeWidth: 3
    })
    this.gridLayer.add(this.shapeXAxis, this.shapeYAxis)

    // draw grid
    let gridImage = new Image()
    gridImage.onload = function () {
      this.shapeGrid = new Konva.Rect({
        fillPatternImage: gridImage,
        fillPatternRepeat: 'repeat',
        height: 500,
        width: canvas.offsetWidth
      })
      this.gridLayer.add(this.shapeGrid)
    }.bind(this)
    gridImage.src = '/static/grid.png'

    // draw vehicle
    Konva.Image.fromURL('/static/pwd.png', image => {
      image.size({
        width: meterToPixels(2.925),
        height: meterToPixels(1.395)
      })
      image.offsetX(image.width() / 2)
      image.offsetY(image.height() / 2)
      image.position({
        x: meterToPixels(this.liveStats.vehicleX),
        y: meterToPixels(this.liveStats.vehicleY)
      })
      this.shapeVehicle = image
      this.vehicleLayer.add(image)
      this.animateStage()
    })

    // add animations
    /* this.animationMiddlePath = new Konva.Animation(this._animateMiddlePath.bind(this), this.vehicleLayer)
    this.animationTrack = new Konva.Animation(this._animateTrack.bind(this), this.vehicleLayer) */
    this.animationVehicle = new Konva.Animation(this.animateVehicle, this.vehicleLayer)
    this.animationStage = new Konva.Animation(this.animateStage, this.vehicleLayer)

    // start animations
    /* this.animationMiddlePath.start()
    this.animationTrack.start() */
    this.animationVehicle.start()
    if (this.focusVehicle) {
      this.animationStage.start()
    }

    // initialise redraw on stage drag
    this.stage.on('dragmove', _ => {
      if (this.showGrid) {
        this.redrawGrid()
      }
    })

    // initialise zoom
    this.stage.attrs.container.addEventListener('mousewheel', this._performZoom.bind(this))
    this.stage.attrs.container.addEventListener('wheel', this._performZoom.bind(this))

    // initialise canvas resizing
    window.addEventListener('load', this.resizeCanvas.bind(this))
    window.addEventListener('resize', this.resizeCanvas.bind(this))
  },
  methods: {
    resizeCanvas () {
      this.stage.width(this.$el.querySelector('#mapWrapper').offsetWidth)
    },
    ...ViewZoom,
    ...ViewAnimation
  },
  components: {
    Switches
  }
}
</script>

<style>
#mapWrapper {
  background: var(--app-background-color);
  height: 500px;
  margin: 20px auto 10px;
  width: 100%;
}
.mapControls {
  margin-bottom: 10px;
}

.controlsCol {
  padding-left: 7.5px;
  padding-right: 7.5px;
  margin-bottom: 10px;
}
.controlsCol:last-of-type {
  padding-right: 15px;
}
.controlsCol:first-of-type {
  padding-left: 15px;
}

.mapControls .controlsFrame {
  border: 1px solid lightgrey;
  border-radius: 3px;
  padding: 5px 10px 0;
}

.mapControls .controlsFrame label {
  display: block;
  font-size: 10px;
  margin-bottom: 5px;
}

.mapControls .controlsFrame code {
  display: block;
  margin: -3px auto 3px;
  text-align: left;
}
</style>
