declare global {
  interface IDisplayName {
    displayName: string
    name: string
  }
}

export const getDisplayName = (a: IDisplayName) => a.displayName || a.name
