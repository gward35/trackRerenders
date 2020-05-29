"use strict"
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k]
          },
        })
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v })
      }
    : function (o, v) {
        o["default"] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, "__esModule", { value: true })
exports.normalizeOptions = exports.DEFAULT_EXCLUDE = exports.DEFAULT_INCLUDE = void 0
const _ = __importStar(require("lodash"))
const notifier_1 = require("./notifier")
exports.DEFAULT_INCLUDE = /./
exports.DEFAULT_EXCLUDE = /[^a-zA-Z0-9()]/
const toRegExp = (s) => (_.isString(s) ? new RegExp(`^${s}$`) : s)
const toArray = (o) => (o ? [].concat(o) : [])
exports.normalizeOptions = (options) => {
  let {
    include = [exports.DEFAULT_INCLUDE],
    exclude = [exports.DEFAULT_EXCLUDE],
    groupByComponent = true,
    collapseComponentGroups = true,
    defaultNotifier = notifier_1.notifier,
  } = options
  return {
    defaultNotifier,
    include: toArray(include).map(toRegExp),
    exclude: toArray(exclude).map(toRegExp),
    groupByComponent,
    collapseComponentGroups,
  }
}
//# sourceMappingURL=normalizeOptions.js.map
