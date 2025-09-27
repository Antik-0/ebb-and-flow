/**
 * 主题配置
 */
export interface ThemeConfig {
  /**
   * Logo 图片
   */
  logo?: string

  /**
   * 头像图片
   */
  avatar?: string

  /**
   * 导航菜单
   */
  navMenus: MenuItemRaw[]

  /**
   * 社交链接
   */
  socialLinks?: SocialLink[]
}

export interface MenuItemRaw {
  /**
   * 文本
   */
  text: string

  /**
   * 图标
   */
  icon?: string

  /**
   * 链接
   */
  link?: string

  /**
   * 是否分组
   */
  grouped?: boolean

  /**
   * 是否折叠
   */
  collapsed?: boolean

  /**
   * 子集
   */
  items?: MenuItemRaw[]
}

export interface SocialLink {
  /**
   * 图标
   */
  icon: string

  /**
   * 链接
   */
  link: string
}
