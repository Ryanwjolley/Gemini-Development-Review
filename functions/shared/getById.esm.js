// ES6 version
const getById = (array, idOrObject, key) => {
  const criteria = typeof idOrObject === 'object' && idOrObject !== null ? idOrObject : { id: idOrObject }
  const obj = array.find(item => {
    for (const [k, v] of Object.entries(criteria)) {
      if (item[k] !== v) return false
    }
    return true
  }) || {}

  return !key ? obj : obj[key]
}

export default getById

