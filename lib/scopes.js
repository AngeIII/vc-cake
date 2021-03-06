var CakeException = require('./exception')

var items = {}
var destructors = {}
var scope = module.exports = {
  actions: {},
  callAction: function (scope, action, attr) {
    if (this.actions[scope] && this.actions[scope][action]) {
      return this.actions[scope][action].apply(this, attr)
    }
    return new CakeException().throw('Wrong action "%s" for scope "%s"', action, scope)
  },
  add: function (name, fn, api) {
    if (typeof items[ name ] !== 'undefined') {
      items[ name ].push({
        name: name,
        loader: fn,
        api: api
      })
    } else {
      items[ name ] = [ {
        name: name,
        loader: fn,
        api: api
      } ]
    }
  },
  load: function () {
    Object.keys(items).forEach(function (key) {
      var scopeItems = items[ key ]
      scopeItems.forEach(function (m) {
        m.loader(m.api)
      })
    })
    items = {}
  },
  clear: function () {
    items = {}
    delete scope.actions
    scope.actions = {}
  },
  destructor: function (name, fn) {
    destructors[name] = fn
  },
  remove: function (name) {
    delete items[name]
    if (destructors[name]) {
      destructors[name]()
    }
    delete destructors[name]
    delete scope.actions[name]
  }
}
