import Util from '@/shared/util'
import StoreUtil from '@/store/store-util'

const VALID_REPLAY_MODES = ['playing', 'paused', 'stopped']
const VALID_VIEW_DATA_SOURCES = ['live', 'replay']

export default {
  updateEntity (state, options) {
    let stateObject = StoreUtil.getStateObjectFromIdentifier(state, options.entityIdentifier)
    for (let key in options.payload) {
      if (stateObject.hasOwnProperty(key)) {
        stateObject[key] = options.payload[key]
      }
    }
  },
  updateRecordings (state, recordings) {
    if (typeof recordings === 'object') {
      state.recordings = recordings
    } else {
      throw new Error('recordings must be an Array')
    }
  },
  updateReplayMode (state, newMode) {
    if (VALID_REPLAY_MODES.indexOf(newMode) >= 0) {
      state.replay.mode = newMode
    } else {
      throw new Error(newMode + ' is not a valid replay mode')
    }
  },
  updateReplayRecording (state, newRecording) {
    state.replay.selectedRecording = newRecording
  },
  updateReplayRecordingActiveFrame (state, newPosition) {
    let selectedRecording = state.replay.selectedRecording
    let frames = selectedRecording.frames
    let minimumDistance = Number.POSITIVE_INFINITY
    let minimumDistanceIndex = -1
    let absolutePosition = selectedRecording.start + newPosition
    if (selectedRecording.start + newPosition > selectedRecording.end || newPosition < 0) {
      throw new Error('newPosition is out of bounds of selectedRecordings: ' + newPosition)
    }
    frames.forEach((v, i) => {
      let distance = Math.abs(absolutePosition - v.timestamp)
      if (distance < minimumDistance) {
        minimumDistance = distance
        minimumDistanceIndex = i
      }
    })
    state.replay.activeFrame = frames[minimumDistanceIndex]
  },
  updateReplayDelta (state, newDelta) {
    state.replay.delta = newDelta
  },
  updateGlobalLoader (state, settings) {
    let validation = Util.validateObjectSchema(settings, ['show', 'message'])
    if (validation.valid) {
      state.globalLoader.message = settings.message
      state.globalLoader.show = settings.show
    } else {
      throw new Error('Missing properties: ' + validation.missing)
    }
  },
  updateViewDataSource (state, newDataSource) {
    if (VALID_VIEW_DATA_SOURCES.indexOf(newDataSource) >= 0) {
      state.viewDataSource = newDataSource
    } else {
      throw new Error(newDataSource + ' is not a valid data source')
    }
  }
}
