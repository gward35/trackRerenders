import _ from "lodash"
import { OptionsObject } from "./normalizeOptions"

export const shouldInclude = (displayName: string, options: OptionsObject) => {
  return (
    _.some(options.include, (r) => r.test(displayName)) &&
    !_.some(options.exclude, (r) => r.test(displayName))
  )
}
