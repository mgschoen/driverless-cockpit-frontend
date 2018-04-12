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
  getApiRouteFromIdentifier: (identifier) => {
    switch (identifier) {
      case 'appState':
        return 'appstate'
      case 'liveStats':
        return 'livestats'
      default:
        throw new Error('Unknown entity identifier: ' + identifier)
    }
  }
}
