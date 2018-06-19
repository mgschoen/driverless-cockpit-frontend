import { meterToPixels, pixelToMeters } from '@/shared/util'
import Konva from 'konva'

export default {
  drive: function () {
    let activeFrame = (this.viewDataSource === 'live')
      ? this.liveStats
      : this.replay.activeFrame
    if (activeFrame) {
      this.animateVehicle(activeFrame.vehicleX, activeFrame.vehicleY)
      this.animateObservations(activeFrame.observations)
      this.animateClusters(activeFrame.clusters)
      this.animateTrajectory(activeFrame.trajectory, activeFrame.trajectoryHash)
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
        radius: meterToPixels(0.2),
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

  animateClusters: function (clusterList) {
    for (let id in clusterList) {
      // Definitions
      let clusterDefinition = clusterList[id]
      let position = {
        x: meterToPixels(clusterDefinition.middleX),
        y: meterToPixels(clusterDefinition.middleY)
      }
      let maxRadius = meterToPixels(Math.max(clusterDefinition.width, clusterDefinition.height))
      let inVisibleViewport = this.isInVisibleWorld(position, maxRadius)
      let clusterShapeExists = this.clusterShapes.hasOwnProperty(id)

      // Only draw shapes that are actually visible
      if (inVisibleViewport) {
        if (clusterShapeExists) {
          if (clusterDefinition.hash !== this.clusterHashes[id]) {
            // If a shape already exists and there have been changes, rerender the shape
            this.clusterShapes[id].position({
              x: meterToPixels(clusterDefinition.middleX),
              y: meterToPixels(clusterDefinition.middleY)
            })
            this.clusterShapes[id].rotation = clusterDefinition.angle
            let ellipses = this.clusterShapes[id].getChildren()
            for (let i = ellipses.length; i > 0; i--) {
              ellipses[i - 1].size({
                width: meterToPixels(clusterDefinition.width * i),
                height: meterToPixels(clusterDefinition.height * i)
              })
            }
          }
        } else {
          // If no shape exists, render a new one
          let newCluster = new Konva.Group({
            x: meterToPixels(clusterDefinition.middleX),
            y: meterToPixels(clusterDefinition.middleY),
            rotation: clusterDefinition.angle
          })
          for (let i of [3, 2, 1]) {
            newCluster.add(new Konva.Ellipse({
              width: meterToPixels(clusterDefinition.width * i),
              height: meterToPixels(clusterDefinition.height * i),
              fill: (clusterDefinition.color === 0) ? 'yellow' : 'blue',
              opacity: 0.5
            }))
          }
          this.clusterShapes[id] = newCluster
          this.clusterLayer.add(newCluster)
        }
      } else {
        if (clusterShapeExists) {
          this.clusterShapes[id].destroyChildren()
          this.clusterShapes[id].destroy()
          delete this.clusterShapes[id]
        }
      }

      this.clusterHashes[id] = clusterDefinition.hash
    }
    // remove all clusters that are not in clusterList
    for (let shapeID in this.clusterShapes) {
      if (!clusterList.hasOwnProperty(shapeID)) {
        this.clusterShapes[shapeID].destroy()
        delete this.clusterShapes[shapeID]
      }
    }
    this.clusterLayer.batchDraw()
  },

  animateTrajectory: function (points, hash) {
    if (hash !== this.lastKnownTrajectoryHash) {
      let pointsTransponed = points.map(v => {
        return meterToPixels(v)
      })
      this.shapeTrajectory.points(pointsTransponed)
      this.lastKnownTrajectoryHash = hash
      this.trajectoryLayer.batchDraw()
    }
  },

  animateStage: function () {
    if (this.stage !== null && this.shapeVehicle !== null) {
      let scale = this.stage.scaleX()
      let canvas = { x: this.stage.width(), y: this.stage.height() }
      let absoluteCarpos = { x: this.shapeVehicle.x(), y: -this.shapeVehicle.y() }
      let onscreenCarpos = { x: absoluteCarpos.x * scale, y: absoluteCarpos.y * scale }
      let camTranslation = { x: this.stage.x(), y: this.stage.y() }
      let onscreenCampos = { x: -camTranslation.x, y: -camTranslation.y }
      let onscreenCamFocus = { x: onscreenCampos.x + canvas.x / 2, y: onscreenCampos.y + canvas.y / 2 }
      let onscreenDist = { x: onscreenCarpos.x - onscreenCamFocus.x, y: onscreenCarpos.y - onscreenCamFocus.y }
      this.stage.move({ x: -onscreenDist.x, y: -onscreenDist.y })
      this.updateRealWorldCursor()
      this.redrawGrid()
      this.stage.batchDraw()
    }
  },

  redrawGrid: function () {
    let visibleWorldDimensions = this.getVisibleWorldDimensions()

    // redraw coordinate axis
    this.shapeXAxis.points([
      visibleWorldDimensions.x, 0,
      visibleWorldDimensions.x + visibleWorldDimensions.width, 0
    ])
    this.shapeYAxis.points([
      0, visibleWorldDimensions.y,
      0, visibleWorldDimensions.y + visibleWorldDimensions.height
    ])

    // redraw grid
    if (this.zoomLevel > 0.5) {
      let gridPosition = {
        x: -100 + Math.round(visibleWorldDimensions.x / 100) * 100,
        y: -100 + Math.round(visibleWorldDimensions.y / 100) * 100
      }
      this.shapeGrid.setPosition(gridPosition)
      this.shapeGrid.setSize({
        width: visibleWorldDimensions.width + 200,
        height: visibleWorldDimensions.height + 200
      })
      this.shapeGrid.show()
    } else {
      // if zoom is too far away, just hide the grid
      this.shapeGrid.hide()
    }

    // redraw labels
    let xMargin = visibleWorldDimensions.x % 100
    let yMargin = visibleWorldDimensions.y % 100
    let xFirstLabel = Math.round(visibleWorldDimensions.x - xMargin - 100)
    let yFirstLabel = Math.round(visibleWorldDimensions.y - yMargin - 100)

    // add new labels
    // possible but likely useless optimisation: remove labels when axis is out of viewport
    for (let x = xFirstLabel; x < visibleWorldDimensions.x + visibleWorldDimensions.width; x += 100) {
      if (!this.xAxisLabels[x] && x !== 0) {
        let label = new Konva.Text({
          x: x,
          y: 3,
          text: pixelToMeters(x).toString(),
          fontSize: 20,
          fontFamily: 'Verdana',
          fill: 'black',
          align: 'center'
        })
        label.offsetX(label.width() / 2)
        this.gridLayer.add(label)
        this.xAxisLabels[x] = label
      }
    }

    for (let y = yFirstLabel; y < visibleWorldDimensions.y + visibleWorldDimensions.height; y += 100) {
      if (!this.yAxisLabels[y] && y !== 0) {
        let label = new Konva.Text({
          x: 0,
          y: y,
          text: pixelToMeters(-y).toString(),
          fontSize: 20,
          fontFamily: 'Verdana',
          fill: 'black',
          align: 'center'
        })
        label.x(-5 - label.width())
        label.offsetY(label.height() / 2)
        this.gridLayer.add(label)
        this.yAxisLabels[y] = label
      }
    }

    // remove unused labels
    Object.keys(this.xAxisLabels).filter(key => {
      return (key < xFirstLabel - 100 || key > visibleWorldDimensions.x + visibleWorldDimensions.width + 100)
    }).forEach(key => {
      this.xAxisLabels[key].destroy()
      delete this.xAxisLabels[key]
    })

    Object.keys(this.yAxisLabels).filter(key => {
      return (key < yFirstLabel - 100 || key > visibleWorldDimensions.x + visibleWorldDimensions.width + 100)
    }).forEach(key => {
      this.yAxisLabels[key].destroy()
      delete this.yAxisLabels[key]
    })
  }
}
