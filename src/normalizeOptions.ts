import * as _ from "lodash"

import { defaultNotifier } from "./defaultNotifier"

export const DEFAULT_INCLUDE = /./
export const DEFAULT_EXCLUDE = /[^a-zA-Z0-9()]/

const toRegExp = (s: string) => (_.isString(s) ? new RegExp(`^${s}$`) : s)
const toArray = (o: []) => (o ? [].concat(o) : [])

export interface OptionsObject {
  // figure out union type for string[] and RegExp[]
  include: any
  exclude: any
  groupByComponent: boolean
  collapseComponentGroups: boolean
  notifier: (
    groupByComponent: boolean,
    collapseComponentGroups: boolean,
    displayName: string,
    diffs: []
  ) => void
}

export interface OptionsObjectConstructor {
  new (
    include: any,
    exclude: any,
    groupByComponent: boolean,
    collapseComponentGroups: boolean,
    notifier: (
      groupByComponent: boolean,
      collapseComponentGroups: boolean,
      displayName: string,
      diffs: []
    ) => void
  ): OptionsObject
  clone(): OptionsObject
}

export var OptionsObject: OptionsObjectConstructor

export const normalizeOptions = (options: OptionsObject) => {
  let {
    include = DEFAULT_INCLUDE,
    exclude = DEFAULT_EXCLUDE,
    groupByComponent = true,
    collapseComponentGroups = true,
    notifier = defaultNotifier,
  } = options

  return {
    include: toArray(include).map(toRegExp),
    exclude: toArray(exclude).map(toRegExp),
    groupByComponent,
    collapseComponentGroups,
    notifier,
  }
}
