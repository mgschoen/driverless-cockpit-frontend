export default {
  _performZoom: function (e) {
    e.stopPropagation()
    e.preventDefault()

    // gather parameters
    let oldScale = this.stage.scaleX()
    let mouseTarget = {
      x: this.stage.getPointerPosition().x / oldScale - this.stage.x() / oldScale,
      y: this.stage.getPointerPosition().y / oldScale - this.stage.y() / oldScale
    }

    // scale stage
    let delta = e.wheelDeltaY || -e.deltaY
    let computedScale = delta > 0 ? oldScale * this.zoomStep : oldScale / this.zoomStep
    let newScale =
      (computedScale < this.minZoomScale)
        ? this.minZoomScale
        : (computedScale > this.maxZoomScale)
          ? this.maxZoomScale
          : computedScale
    this.stage.scale({x: newScale, y: newScale})

    // move stage to mouse position
    let newPos = {
      x: -(mouseTarget.x - this.stage.getPointerPosition().x / newScale) * newScale,
      y: -(mouseTarget.y - this.stage.getPointerPosition().y / newScale) * newScale
    }
    this.stage.position(newPos)

    // update grid
    this.redrawGrid()

    // redraw
    this.stage.batchDraw()

    // update scale value in view
    this.zoomLevel = parseFloat(Math.round(newScale * 100) / 100).toFixed(2)
  }
}
