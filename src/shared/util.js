const PX_PER_METER = 10

module.exports = {
  /**
   * If `string` has less than `numChars` characters, prefix it with the matching number of zeros
   * @param numChars - minimum number of characters of the returned string
   * @param string - input string
   * @returns {string}
   */
  padZeros: (numChars, string) => {
    let convertedString = string + ''
    let strlen = convertedString.length
    let numZeros = Math.max(0, numChars - strlen)
    return '0'.repeat(numZeros) + string
  },
  /**
   * Convert a given number of milliseconds to a string of format mm:ss:nnn
   * (m = minutes, s = seconds, n = milliseconds)
   * @param milliseconds
   * @returns {string}
   */
  timerFormat: function (milliseconds) {
    let minutes = Math.floor(milliseconds / 60000)
    let seconds = Math.floor((milliseconds % 60000) / 1000)
    let msecs = milliseconds % 1000
    return this.padZeros(2, minutes) + ':' +
        this.padZeros(2, seconds) + ':' +
        this.padZeros(3, msecs)
  },
  validateObjectSchema: function (object, requiredProperties) {
    let missing = []
    requiredProperties.forEach(property => {
      if (!object.hasOwnProperty(property)) {
        missing.push(property)
      }
    })
    if (missing.length === 0) {
      return {
        valid: true,
        missing: missing
      }
    } else {
      return {
        valid: false,
        missing: missing
      }
    }
  },
  meterToPixels: function (m) {
    return Math.round(m * PX_PER_METER)
  }
}
