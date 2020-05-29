import * as _ from "lodash"

import { notifier } from "./notifier"

export const DEFAULT_INCLUDE = /./
export const DEFAULT_EXCLUDE = /[^a-zA-Z0-9()]/

const toRegExp = (s: string) => (_.isString(s) ? new RegExp(`^${s}$`) : s)
const toArray = (o: []) => (o ? [].concat(o) : [])

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
let opts = {
  include: DEFAULT_INCLUDE,
  exclude: DEFAULT_EXCLUDE,
  groupByComponent: true,
  collapseComponentGroups: true,
  defaultNotifier: notifier,
}

export const normalizeOptions = (options: OptionsObject = opts) => {
  let {
    include = DEFAULT_INCLUDE,
    exclude = DEFAULT_EXCLUDE,
    groupByComponent = true,
    collapseComponentGroups = true,
    defaultNotifier = notifier,
  } = options

  return {
    include: toArray(include).map(toRegExp),
    exclude: toArray(exclude).map(toRegExp),
    groupByComponent,
    collapseComponentGroups,
    defaultNotifier,
  }
}
