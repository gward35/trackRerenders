export interface IDisplayName {
  new (props: object[], context: object[]): IDisplayName
  displayName: string
  name: string
  type: string
  contextTypes: string
}

export const getDisplayName = (ctor: IDisplayName) =>
  ctor.displayName || ctor.name
