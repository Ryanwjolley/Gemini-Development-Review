const routes = [require('./error'), require('./user')]

module.exports = app => {
  routes.forEach(cb => cb(app))
}
