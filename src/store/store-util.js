const CONFIG = {
  appState: {
    requiredProperties: ['activeRecording', 'connected', 'recording', 'presentationMode'],
    refreshInterval: 500
  },
  liveStats: {
    requiredProperties: ['timestamp', 'steerAngle', 'pathMiddleX', 'pathMiddleY', 'vehicleX',
      'vehicleY', 'vehicleVelocityX', 'vehicleVelocityY', 'vehicleRotation', 'frontwheelLeftRotation',
      'frontwheelRightRotation', 'observations', 'clusters', 'trajectory', 'trajectoryHash', 'trajectoryPrimitives'],
    refreshInterval: 100
  }
}

module.exports = {
  getStateObjectFromIdentifier: (state, identifier) => {
    switch (identifier) {
      case 'appState':
        return state.appState
      case 'liveStats':
        return state.liveStats
      default:
        throw new Error('Unknown entity identifier: ' + identifier)
    }
  },
  getApiRouteFromIdentifier: identifier => {
    switch (identifier) {
      case 'appState':
        return 'appstate'
      case 'liveStats':
        return 'livestats'
      case 'start':
        return 'recording/start'
      case 'stop':
        return 'recording/stop'
      default:
        throw new Error('Unknown entity identifier: ' + identifier)
    }
  },
  getConfigFromIdentifier: identifier => {
    switch (identifier) {
      case 'appState':
        return CONFIG['appState']
      case 'liveStats':
        return CONFIG['liveStats']
      default:
        throw new Error('Unknown entity identifier: ' + identifier)
    }
  }
}
