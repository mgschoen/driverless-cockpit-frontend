export default {
  padZeros: (numChars, string) => {
    let convertedString = string + ''
    let strlen = convertedString.length
    let numZeros = Math.max(0, numChars - strlen)
    return '0'.repeat(numZeros) + string
  }
}
