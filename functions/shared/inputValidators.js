const validateEmail = str => /\S+@\S+\.\S+/.test(str)
const validateZip = str => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(str)
const validatePhone = str => str.replace(/\D/g, '').length === 10

module.exports = {
  validateEmail,
  validatePhone,
  validateZip,
}
