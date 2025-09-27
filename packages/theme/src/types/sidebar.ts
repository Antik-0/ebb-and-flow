export interface SidebarItemRaw {
  /**
   * The text label of the item.
   */
  text: string

  /**
   * The link of the item.
   */
  link: string

  /**
   * If not specified, group is not collapsible.
   *
   * If `true`, group is collapsible and collapsed by default
   *
   * If `false`, group is collapsible but expanded by default
   */
  collapsed?: boolean

  /**
   * The children of the item.
   */
  items?: SidebarItemRaw[]
}

export interface SidebarItem extends SidebarItemRaw {
  /**
   * The active state of the item.
   */
  acitve?: boolean
  /**
   * The parent node of the item.
   */
  parent?: SidebarItem
}
