// ES6 version
const csvify = arrayOfArrays =>
  arrayOfArrays.map(arr =>
    arr.map(cell => {
      const cellStr = String(cell)
      return cellStr.match(/[\s,"]/)
        ? `"${cellStr.replace(/"/g, '""')}"` // escape double quotes, as well as put quotes around stuff with commas and spaces
        : cellStr
    }).join(',')
  ).join('\n')

export default csvify

