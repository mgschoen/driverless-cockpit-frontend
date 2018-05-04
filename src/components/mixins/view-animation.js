import { meterToPixels } from '@/shared/util'
import Konva from 'konva'

export default {
  /* _animateMiddlePath: _ => {
    let points = this.shapeMiddlePath.points()
    let last = {x: points[points.length - 2], y: points[points.length - 1] }
    if (this.__pathMiddleX != last.x || this.__pathMiddleX != last.y) {
      if (points.length >= 2 && points[0] == 0 && points[1] == 0) {
        points.shift(); points.shift()
      }
      this.shapeMiddlePath.points(points.concat([this.__pathMiddleX, this.__pathMiddleY]))
    }
  },

  _animateTrack: _ => {
    let points = this.shapeTrack.points()
    let last = {x: points[points.length - 2], y: points[points.length - 1] }
    if (this.__vehicleX != last.x || this.__vehicleY != last.y) {
      if (points.length >= 2 && points[0] == 0 && points[1] == 0) {
        points.shift(); points.shift()
      }
      this.shapeTrack.points(points.concat([this.__vehicleX, this.__vehicleY]))
    }
  }, */

  drive: function () {
    let activeFrame = (this.viewDataSource === 'live')
      ? this.liveStats
      : this.replay.activeFrame
    if (activeFrame) {
      this.animateVehicle(activeFrame.vehicleX, activeFrame.vehicleY)
      this.animateObservations((activeFrame.observations))
    }
  },

  animateVehicle: function (x, y) {
    if (this.shapeVehicle) {
      let nextVehiclePosition = { x: x, y: y }

      // Only update vehicle if its position has changed since last animation frame
      if (nextVehiclePosition.x !== this.lastKnownVehiclePosition.x ||
          nextVehiclePosition.y !== this.lastKnownVehiclePosition.y) {
        // move
        this.shapeVehicle.position({
          x: meterToPixels(nextVehiclePosition.x),
          y: meterToPixels(nextVehiclePosition.y)
        })

        // rotate
        let direction = {
          x: nextVehiclePosition.x - this.lastKnownVehiclePosition.x,
          y: nextVehiclePosition.y - this.lastKnownVehiclePosition.y
        }
        let dirLength = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2))
        let cosine = direction.x / dirLength
        let degree = Math.acos(cosine) * (180 / Math.PI)
        let rotation = (direction.y >= 0) ? degree : (360 - degree)
        if (this.viewDataSource === 'replay' && this.replay.delta < 0) {
          rotation = (rotation + 180) % 360
        }
        this.shapeVehicle.rotation(rotation)

        // update last known position
        this.lastKnownVehiclePosition.x = nextVehiclePosition.x
        this.lastKnownVehiclePosition.y = nextVehiclePosition.y
      }
    }
  },

  animateObservations: function (observationsList) {
    let newDots = []
    for (let observation of observationsList) {
      newDots.push(new Konva.Circle({
        x: meterToPixels(observation.x),
        y: meterToPixels(observation.y),
        radius: 4,
        fill: 'black'
      }))
    }
    for (let oldShape of this.observationsShapes) {
      oldShape.destroy()
    }
    for (let newShape of newDots) {
      this.observationsLayer.add(newShape)
    }
    this.observationsShapes = newDots
    this.observationsLayer.draw()
  },

  animateStage: function () {
    if (this.stage !== null && this.shapeVehicle !== null) {
      let scale = this.stage.scaleX()
      let canvas = { x: this.stage.width(), y: this.stage.height() }
      let absoluteCarpos = { x: this.shapeVehicle.x(), y: this.shapeVehicle.y() }
      let onscreenCarpos = { x: absoluteCarpos.x * scale, y: absoluteCarpos.y * scale }
      let camTranslation = { x: this.stage.x(), y: this.stage.y() }
      let onscreenCampos = { x: -camTranslation.x, y: -camTranslation.y }
      let onscreenCamFocus = { x: onscreenCampos.x + canvas.x / 2, y: onscreenCampos.y + canvas.y / 2 }
      let onscreenDist = { x: onscreenCarpos.x - onscreenCamFocus.x, y: onscreenCarpos.y - onscreenCamFocus.y }
      this.stage.move({ x: -onscreenDist.x, y: -onscreenDist.y })
      this.redrawGrid()
      this.stage.batchDraw()
    }
  },

  redrawGrid: function () {
    // determine viewport size and translation
    let scale = this.stage.scale()
    let visibleViewportSize = {
      width: this.stage.width() / scale.x,
      height: this.stage.height() / scale.y
    }
    let realWorldViewportTranslation = {
      x: this.stage.x() / scale.x,
      y: this.stage.y() / scale.y
    }

    // redraw coordinate axis
    this.shapeXAxis.points([
      -realWorldViewportTranslation.x, 0,
      -realWorldViewportTranslation.x + visibleViewportSize.width, 0
    ])
    this.shapeYAxis.points([
      0, -realWorldViewportTranslation.y,
      0, -realWorldViewportTranslation.y + visibleViewportSize.height
    ])

    // redraw grid
    if (this.zoomLevel > 0.5) {
      let gridPosition = {
        x: -100 - Math.round(realWorldViewportTranslation.x / 100) * 100,
        y: -100 - Math.round(realWorldViewportTranslation.y / 100) * 100
      }
      this.shapeGrid.setPosition(gridPosition)
      this.shapeGrid.setSize({
        width: visibleViewportSize.width + 200,
        height: visibleViewportSize.height + 200
      })
      this.shapeGrid.show()
    } else {
      // if zoom is too far away, just hide the grid
      this.shapeGrid.hide()
    }
  }
}
