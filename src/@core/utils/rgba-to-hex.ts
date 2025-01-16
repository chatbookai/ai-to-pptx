/**
 ** RGBA color to Hex color with / without opacity
 */
export const rgbaToHex = (rgba: string, forceRemoveAlpha = false) => {
  return (
    '#' +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
      .split(',') // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string)) // Converts them to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map(number => number.toString(16)) // Converts numbers to hex
      .map(string => (string.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
      .join('')
  )
}
