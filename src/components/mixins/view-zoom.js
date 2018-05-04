export default {
  /**
   * Scale and move the stage according to delta and pointer position
   * @param delta - difference in scale; if > 0 stage is zoomed in, otherwise out
   * @param zoomOriginX - zoomOrigin describes the point in viewport space that
   *                      the zoom is performed around, relative to the upper left
   *                      corner of the stage; x-coordinate
   * @param zoomOriginY - see `zoomOriginX`; y-coordinate
   */
  scaleStage: function (delta, zoomOriginX, zoomOriginY) {
    // gather parameters
    let oldScale = this.stage.scaleX()
    let zoomTargetWorld = {
      x: zoomOriginX / oldScale - this.stage.x() / oldScale,
      y: zoomOriginY / oldScale - this.stage.y() / oldScale
    }

    // scale stage
    let computedScale = delta > 0 ? oldScale * this.zoomStep : oldScale / this.zoomStep
    let newScale =
      (computedScale < this.minZoomScale)
        ? this.minZoomScale
        : (computedScale > this.maxZoomScale)
          ? this.maxZoomScale
          : computedScale
    this.stage.scale({x: newScale, y: newScale})

    // move stage to zoom target
    let newPos = {
      x: -(zoomTargetWorld.x - zoomOriginX / newScale) * newScale,
      y: -(zoomTargetWorld.y - zoomOriginY / newScale) * newScale
    }
    this.stage.position(newPos)

    // update grid
    this.redrawGrid()

    // redraw
    this.stage.batchDraw()

    // update scale value in view
    this.zoomLevel = parseFloat(Math.round(newScale * 100) / 100).toFixed(2)
  },
  performZoom: function (e) {
    e.stopPropagation()
    e.preventDefault()

    let delta = e.wheelDeltaY || -e.deltaY
    let pointerPosition = this.stage.getPointerPosition()
    this.scaleStage(delta, pointerPosition.x, pointerPosition.y)
  },
  performZoomTouch: function (e) {
    // is this a pinch event?
    if (e.targetTouches.length === 2) {
      // no native zoom
      e.stopPropagation()
      e.preventDefault()

      let p1 = e.targetTouches[0]
      let p2 = e.targetTouches[1]
      let newTouchDistance = Math.sqrt(Math.pow(p1.clientX - p2.clientX, 2) + Math.pow(p1.clientY - p2.clientY, 2))
      if (this.lastTouchDistance) {
        // scale stage according to the difference in distance
        // between the two touches (has it decreased or increased?)
        let delta = newTouchDistance - this.lastTouchDistance
        let clientMiddle = {
          x: (p1.clientX + p2.clientX) / 2,
          y: (p1.clientY + p2.clientY) / 2
        }
        let canvasViewportOffset = this.stage.attrs.container.getBoundingClientRect()
        let canvasMiddle = {
          x: clientMiddle.x - canvasViewportOffset.x,
          y: clientMiddle.y - canvasViewportOffset.y
        }
        this.scaleStage(delta, canvasMiddle.x, canvasMiddle.y)
      } else {
        this.lastTouchDistance = newTouchDistance
      }
    }
  }
}
