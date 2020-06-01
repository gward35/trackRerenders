import { classifyDiff, DIFF_TYPES } from "./diff"
import { getDisplayName, IDisplayName } from "./getDisplayName"
import { normalizeOptions, OptionsObject } from "./normalizeOptions"
import { shouldInclude } from "./shouldInclude"

const memoized = (map: Map<string, object>, key: string, fn: () => {}) => {
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

function createComponentDidUpdate(displayName: string, options: OptionsObject) {
  return function componentDidUpdate(
    this: any,
    prevProps: object[],
    prevState: object[]
  ) {
    const propsDiff = classifyDiff(
      prevProps,
      this.props,
      `${displayName}.props`
    )
    if (propsDiff.type === DIFF_TYPES.UNAVOIDABLE) {
      return
    }

    const stateDiff = classifyDiff(
      prevState,
      this.state,
      `${displayName}.state`
    )
    if (stateDiff.type === DIFF_TYPES.UNAVOIDABLE) {
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
const createClassComponent = (
  ctor: IDisplayName,
  displayName: string,
  options: OptionsObject
) => {
  let cdu = createComponentDidUpdate(displayName, options)

  // the wrapper class extends the original class,
  // and overwrites its `componentDidUpdate` method,
  // to allow why-did-you-update to listen for updates.
  // If the component had its own `componentDidUpdate`,
  // we call it afterwards.`

  let TRRClassComponent = class extends ctor {
    componentDidUpdate(
      prevProps: object[],
      prevState: object[],
      snapshot: object
    ) {
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

const createFunctionalComponent = (
  ctor: IDisplayName,
  displayName: string,
  options: OptionsObject
) => {
  let cdu = createComponentDidUpdate(displayName, options)

  let previousProps = [{}]
  let state = [{}]
  let TRRClassComponent = class extends ctor {
    function(props: object[], context: object[]) {
      cdu.call({ props, state }, previousProps, state)
      previousProps = props
      return new ctor(props, context)
    }
  }

  TRRClassComponent.displayName = displayName
  TRRClassComponent.contextTypes = ctor.contextTypes

  return TRRClassComponent
}

export const trackReRenders = (React: any, options: OptionsObject) => {
  options = normalizeOptions(options)

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
  React.createElement = function (type: any, ...rest: []) {
    let ctor = type

    const displayName = getDisplayName(ctor)
    // the element is a class component or a functional component
    if (typeof ctor === "function" && shouldInclude(displayName, options)) {
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

export default trackReRenders
