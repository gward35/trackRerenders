"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.notifier = void 0
const diff_1 = require("./diff")
exports.notifier = (
  groupByComponent,
  collapseComponentGroups,
  displayName,
  diffs
) => {
  if (groupByComponent && collapseComponentGroups) {
    console.groupCollapsed && console.groupCollapsed(displayName)
  } else if (groupByComponent) {
    console.group && console.group(displayName)
  }
  diffs.forEach(notifyDiff)
  if (groupByComponent) {
    console.groupEnd && console.groupEnd()
  }
}
const consoleWarn = (args) => {
  const oldDisableYellowBox = console.disableYellowBox
  console.disableYellowBox = true
  console.warn(args)
  console.disableYellowBox = oldDisableYellowBox
}
const notifyDiff = (p) => {
  const { name, prev, next, type } = p
  switch (type) {
    case diff_1.DIFF_TYPES.SAME:
      consoleWarn(
        `${name}: Value is the same (equal by reference). Avoidable re-render!`
      )
      console.log(`Value:`, prev)
      break
    case diff_1.DIFF_TYPES.EQUAL:
      consoleWarn(`${name}: Value did not change. Avoidable re-render!`)
      console.log(`Before:`, prev)
      console.log(`After`, next)
      if (prev && next) {
        Object.keys(prev).forEach((key) => {
          if (prev[key] !== next[key]) {
            console.log('"' + key + '" property is not equal by reference')
          }
        })
      }
      break
    case diff_1.DIFF_TYPES.FUNCTIONS:
      consoleWarn(
        `${name}: Changes are in functions only. Possibly avoidable re-render?`
      )
      console.log(`Functions before:`, prev)
      console.log(`Functions after:`, next)
      break
  }
}
//# sourceMappingURL=notifier.js.map
