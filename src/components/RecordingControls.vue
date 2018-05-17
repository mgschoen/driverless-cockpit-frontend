<template>
  <div>
    <b-row align-h="end">
      <b-col cols="auto" class="pr-0" v-if="appState.recording">
        <code class="button-indent">{{counterValue}}</code>
      </b-col>
      <b-col cols="auto">
        <b-button-group>
          <!-- stop button -->
          <b-button :disabled="!appState.recording"
                    @click="triggerStop">
            <span class="panelIcon stop"></span>
          </b-button>
          <!-- record button -->
          <b-button :pressed="appState.recording"
                    @click="triggerRecording">
            <span class="panelIcon record"></span>
          </b-button>
        </b-button-group>
      </b-col>
    </b-row>

    <b-modal title="Enter Passphrase"
             v-model="showPrompt"
             no-close-on-esc
             no-close-on-backdrop
             hide-header-close>
      <p class="errorMessage" v-if="error">Wrong passphrase. Please try again.</p>
      <b-form-input v-model="enteredPassphrase" type="password"></b-form-input>
      <div slot="modal-footer">
        <b-button variant="secondary" @click="checkPassphrase">Ok</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SHA512 } from 'jshashes'
import Util from '@/shared/util.js'

export default {
  name: 'RecordingControls',
  data () {
    return {
      // properties
      correctPassphraseHashed: 'c4ae69280ce2f63b5983bfd58d4e80395b1a33a77d54dca7d3db146db4a701b803e45a088a4fe849d78ec5ad703f8856aea0285bbebbefc5285ceddef4c7d8f7',
      enteredPassphrase: '',

      // view controls
      showPrompt: false,
      error: false,
      action: 'record',

      // helpers
      hasher: new SHA512()
    }
  },
  computed: {
    clipPosition: function () {
      if (this.appState && this.appState.recording) {
        let now = new Date().getTime()
        return now - this.appState.activeRecording.start
      }
      return 0
    },
    counterValue: function () {
      return Util.timerFormat(this.clipPosition)
    },
    ...mapState({
      appState: 'appState'
    })
  },
  methods: {
    triggerRecording: function () {
      if (!this.appState.recording) {
        if (this.appState.presentationMode) {
          this.action = 'record'
          this.showPrompt = true
        } else {
          this.record()
        }
      }
    },
    triggerStop: function () {
      if (this.appState.recording) {
        if (this.appState.presentationMode) {
          this.action = 'stop'
          this.showPrompt = true
        } else {
          this.stop()
        }
      }
    },
    record: function () {
      this.$store.dispatch('switchRecordingStatus', 'start').then(null, error => {
        console.log(error)
      })
    },
    stop: function () {
      this.$store.dispatch('switchRecordingStatus', 'stop').then(_ => {
        this.$router.push('/recordings')
      }, error => {
        console.log(error)
      })
    },
    checkPassphrase: function () {
      let enteredPassphraseHashed = this.hasher.hex(this.enteredPassphrase)
      if (enteredPassphraseHashed === this.correctPassphraseHashed) {
        switch (this.action) {
          // Start recording
          case 'record':
            this.record()
            break
          // stop recording
          case 'stop':
          default:
            this.stop()
        }
        this.showPrompt = false
      } else {
        this.error = true
      }
      this.enteredPassphrase = ''
    }
  }
}
</script>

<style scoped>
  @keyframes flash {
    0% {
      background-color: darkred;
    }
    50% {
      background-color: red;
    }
    100% {
      background-color: darkred;
    }
  }
  .panelIcon {
    display: inline-block;
    width: 12px;
    height: 12px;
  }
  .stop {
    background: lightgray;
    border-radius: 2px;
  }
  .record {
    border-radius:6px;
    background: darkred;
  }
  .active .panelIcon.record {
    animation: 1s ease-in infinite flash;
  }
  .errorMessage {
    color: darkred;
  }
</style>
