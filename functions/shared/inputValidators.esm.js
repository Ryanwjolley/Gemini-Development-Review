// ES6 version
export const validateEmail = str => /\S+@\S+\.\S+/.test(str)
export const validateZip = str => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(str)
export const validatePhone = str => str.replace(/\D/g, '').length === 10

