"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.trackReRenders = void 0
const diff_1 = require("./diff")
const getDisplayName_1 = require("./getDisplayName")
const normalizeOptions_1 = require("./normalizeOptions")
const shouldInclude_1 = require("./shouldInclude")
const memoized = (map, key, fn) => {
  // key already in the memoizer
  if (map.has(key)) {
    return map.get(key)
  }
  // key not in memoizer
  // evaluate the function to get the value to store our memoizer
  let ret = fn()
  map.set(key, ret)
  return ret
}
function createComponentDidUpdate(displayName, options) {
  return function componentDidUpdate(prevProps, prevState) {
    const propsDiff = diff_1.classifyDiff(
      prevProps,
      this.props,
      `${displayName}.props`
    )
    if (propsDiff.type === diff_1.DIFF_TYPES.UNAVOIDABLE) {
      return
    }
    const stateDiff = diff_1.classifyDiff(
      prevState,
      this.state,
      `${displayName}.state`
    )
    if (stateDiff.type === diff_1.DIFF_TYPES.UNAVOIDABLE) {
      return
    }
    options.defaultNotifier(
      options.groupByComponent,
      options.collapseComponentGroups,
      displayName,
      [propsDiff, stateDiff]
    )
  }
}
// Creates a wrapper for a React class component
const createClassComponent = (ctor, displayName, options) => {
  let cdu = createComponentDidUpdate(displayName, options)
  // the wrapper class extends the original class,
  // and overwrites its `componentDidUpdate` method,
  // to allow why-did-you-update to listen for updates.
  // If the component had its own `componentDidUpdate`,
  // we call it afterwards.`
  let TRRClassComponent = class extends ctor {
    componentDidUpdate(prevProps, prevState, snapshot) {
      cdu.call(this, prevProps, prevState)
      if (typeof ctor.prototype.componentDidUpdate === "function") {
        ctor.prototype.componentDidUpdate.call(
          this,
          prevProps,
          prevState,
          snapshot
        )
      }
    }
  }
  // our wrapper component needs an explicit display name
  // based on the original constructor.
  const descriptor = Object.getOwnPropertyDescriptor(
    TRRClassComponent,
    "displayName"
  )
  if (!TRRClassComponent.displayName || (descriptor && descriptor.writable)) {
    TRRClassComponent.displayName = displayName
  }
  return TRRClassComponent
}
// Creates a wrapper for a React functional component
const createFunctionalComponent = (ctor, displayName, options) => {
  let cdu = createComponentDidUpdate(displayName, options)
  let previousProps = {}
  let state = {}
  let TRRClassComponent = function (props, context) {
    cdu.call({ props, state }, previousProps, state)
    previousProps = props
    return new ctor(props, context)
  }
  console.log(TRRClassComponent)
  TRRClassComponent.displayName = displayName
  TRRClassComponent.contextTypes = ctor.contextTypes
  return TRRClassComponent
}
exports.trackReRenders = (React, options) => {
  options = normalizeOptions_1.normalizeOptions(options)
  // Store the original `React.createElement`,
  // which we're going to reference in our own implementation
  // and which we put back when we remove `trackReRenders` from React.
  let _createReactElement = React.createElement
  // The memoizer is a JavaScript map that allows us to return
  // the same WrappedComponent for the same original constructor.
  // This ensure that by wrapping the constructor, we don't break
  // React's reconciliation process.
  const memo = new Map()
  // Our new implementation of `React.createElement` works by
  // replacing the element constructor with a class that wraps it.
  React.createElement = function (type, ...rest) {
    let ctor = type
    const displayName = getDisplayName_1.getDisplayName(ctor)
    // the element is a class component or a functional component
    if (
      typeof ctor === "function" &&
      shouldInclude_1.shouldInclude(displayName, options)
    ) {
      if (ctor.prototype && typeof ctor.prototype.render === "function") {
        // If the constructor has a `render` method in its prototype,
        // we're dealing with a class component
        ctor = memoized(memo, ctor, () =>
          createClassComponent(ctor, displayName, options)
        )
      } else {
        // If the constructor function has no `render`,
        // it must be a simple functioanl component.
        ctor = memoized(memo, ctor, () =>
          createFunctionalComponent(ctor, displayName, options)
        )
      }
    }
    // Call the old `React.createElement, but with our overwritten constructor
    return _createReactElement.apply(React, [ctor, ...rest])
  }
  React.__TRACK_RERENDERS__ = () => {
    React.createElement = _createReactElement
    delete React.__TRACK_RENDERS__
  }
  return React
}
exports.default = exports.trackReRenders
//# sourceMappingURL=index.js.map
