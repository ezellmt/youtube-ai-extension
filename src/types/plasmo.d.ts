declare module "plasmo" {
  export interface PlasmoCSConfig {
    matches: string[]
  }

  export interface PlasmoGetInlineAnchor {
    (): Promise<{
      element: Element | null
      insertPosition: InsertPosition
    }>
  }
}
