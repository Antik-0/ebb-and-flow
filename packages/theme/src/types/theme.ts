/**
 * 主题配置
 */
export interface ThemeConfig {
  /**
   * 头像图片
   */
  avatar: string

  /**
   * 樱花动效图片
   */
  sakura?: string

  /**
   * 导航菜单
   */
  navMenus: MenuItemRaw[]

  /**
   * 社交链接
   */
  socialLinks?: SocialLink[]

  /**
   * 背景图片
   */
  backgrounds?: Backgrounds
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

export interface Backgrounds {
  dark?: string[]
  light?: string[]

  /**
   * 背景切换间隔时间
   * @default 60_000
   */
  interval?: number
}
