import { DIFF_TYPES } from "./diff"

//extend console interface to attach and define methods
declare global {
  interface Console {
    disableYellowBox: boolean
  }
}

export const notifier = (
  groupByComponent: boolean,
  collapseComponentGroups: boolean,
  displayName: string,
  diffs: []
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

const consoleWarn = (args: string) => {
  const oldDisableYellowBox = console.disableYellowBox
  console.disableYellowBox = true
  console.warn(args)
  console.disableYellowBox = oldDisableYellowBox
}

interface INotifyDiffArgs {
  name: string
  prev: object[]
  next: object[]
  type: string
  [key: number]: number
}

const notifyDiff = (p: INotifyDiffArgs) => {
  const { name, prev, next, type } = p

  switch (type) {
    case DIFF_TYPES.SAME:
      consoleWarn(
        `${name}: Value is the same (equal by reference). Avoidable re-render!`
      )
      console.log(`Value:`, prev)
      break
    case DIFF_TYPES.EQUAL:
      consoleWarn(`${name}: Value did not change. Avoidable re-render!`)
      console.log(`Before:`, prev)
      console.log(`After`, next)

      if (prev && next) {
        ;(Object.keys(prev) as Array<keyof INotifyDiffArgs>).forEach(
          (key: number) => {
            if (prev[key] !== next[key]) {
              console.log('"' + key + '" property is not equal by reference')
            }
          }
        )
      }
      break

    case DIFF_TYPES.FUNCTIONS:
      consoleWarn(
        `${name}: Changes are in functions only. Possibly avoidable re-render?`
      )
      console.log(`Functions before:`, prev)
      console.log(`Functions after:`, next)
      break
  }
}
