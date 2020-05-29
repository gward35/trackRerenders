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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
exports.classifyDiff = exports.DIFF_TYPES = void 0
const _ = __importStar(require("lodash"))
const react_fast_compare_1 = __importDefault(require("react-fast-compare"))
var DIFF_TYPES
;(function (DIFF_TYPES) {
  DIFF_TYPES["UNAVOIDABLE"] = "unavoidable"
  DIFF_TYPES["SAME"] = "same"
  DIFF_TYPES["EQUAL"] = "equal"
  DIFF_TYPES["FUNCTIONS"] = "functions"
})((DIFF_TYPES = exports.DIFF_TYPES || (exports.DIFF_TYPES = {})))
exports.classifyDiff = (prev, next, name) => {
  if (prev === next) {
    return {
      type: DIFF_TYPES.SAME,
      name,
      prev,
      next,
    }
  }
  if (react_fast_compare_1.default(prev, next)) {
    return {
      type: DIFF_TYPES.EQUAL,
      name,
      prev,
      next,
    }
  }
  if (!prev || !next) {
    return {
      type: DIFF_TYPES.UNAVOIDABLE,
      name,
      prev,
      next,
    }
  }
  const isChanged = (key) =>
    prev[key] !== next[key] && !_.isEqual(prev[key], next[key])
  const isSameFunction = (key) => {
    const prevFn = prev[key]
    const nextFn = next[key]
    return (
      _.isFunction(prevFn) &&
      _.isFunction(nextFn) &&
      prevFn.name === nextFn.name
    )
  }
  const keys = _.union(_.keys(prev), _.keys(next))
  const changedKeys = _.filter(keys, isChanged)
  if (changedKeys.length && _.every(changedKeys, isSameFunction)) {
    return {
      type: DIFF_TYPES.FUNCTIONS,
      name,
      prev: _.pick(prev, changedKeys),
      next: _.pick(next, changedKeys),
    }
  }
  return {
    type: DIFF_TYPES.UNAVOIDABLE,
    name,
    prev,
    next,
  }
}
//# sourceMappingURL=diff.js.map
