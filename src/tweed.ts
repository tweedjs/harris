declare const require: any
declare const module: any
export declare const mutating: any

try {
  module.exports = require('tweed')
} catch (e) {
  module.exports = {
    mutating: function () {}
  }
}
