import * as _ from "lodash"

type OptionsObject = {
  // figure out union type for string[] and RegExp[]
  include: any
  exclude: any
  groupByComponent: boolean
  collapseComponentGroups: boolean
  defaultNotifier: (
    groupByComponent: boolean,
    collapseComponentGroups: boolean,
    displayName: string,
    diffs: []
  ) => void
}

const shouldInclude = function (displayName: string, options: OptionsObject) {
  return (
    _.some(options.include, (r) => r.test(displayName)) &&
    !_.some(options.exclude, (r) => r.test(displayName))
  )
}

export default shouldInclude
