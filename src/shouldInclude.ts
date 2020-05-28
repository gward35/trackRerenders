import * as _ from "lodash"

type OptionsObject = {
  // figure out union type for string[] and RegExp[]
  include: any
  exclude: any
}

export const shouldInclude = (displayName: string, options: OptionsObject) => {
  return (
    _.some(options.include, (r) => r.test(displayName)) &&
    !_.some(options.exclude, (r) => r.test(displayName))
  )
}
