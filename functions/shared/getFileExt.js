const getFileExt = filename => filename.split('.').slice(-1)[0].toLowerCase()
module.exports = getFileExt
