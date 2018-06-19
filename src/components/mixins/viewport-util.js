export default {
  getVisibleWorldDimensions: function () {
    let scale = this.stage.scale()
    return {
      x: -this.stage.x() / scale.x,
      y: -this.stage.y() / scale.y,
      width: this.stage.width() / scale.x,
      height: this.stage.height() / scale.y
    }
  },

  isInVisibleWorld: function (position, additionalMargin) {
    if (typeof position !== 'object' || !position.hasOwnProperty('x') || !position.hasOwnProperty('y')) {
      throw new Error('ViewportUtil: `position` does not match the specification')
    }
    if (additionalMargin && typeof additionalMargin !== 'number') {
      throw new Error('ViewportUtil: `additionalMargin` must be a number')
    }
    let visibleWorldDimensions = this.getVisibleWorldDimensions()
    let margin = additionalMargin || 0
    let range = {
      x: {
        min: visibleWorldDimensions.x - margin,
        max: visibleWorldDimensions.x + visibleWorldDimensions.width + margin
      },
      y: {
        min: visibleWorldDimensions.y - margin,
        max: visibleWorldDimensions.y + visibleWorldDimensions.height + margin
      }
    }
    return (position.x >= range.x.min && position.x <= range.x.max &&
        -position.y >= range.y.min && -position.y <= range.y.max)
  }
}
