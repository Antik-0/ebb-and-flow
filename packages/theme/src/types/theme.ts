export interface ThemeConfig {
  /**
   * 网站默认标题
   */
  title: string

  /**
   * 网站标题模板
   */
  titleTemplate?: string

  /**
   * 404 页面标题
   */
  notFoundTitle?: string

  /**
   * 头像
   */
  avatar: string

  /**
   * 作者
   */
  author: string

  /**
   * 标语
   */
  tagline: string

  /**
   * 编程技能
   */
  codes: string[]

  /**
   * 默认激活的菜单链接
   */
  defaultActiveLink: string

  /**
   * 导航菜单
   */
  navMenus: NavMenuRecord[]

  /**
   * 社交链接
   */
  socialLinks?: SocialLink[]
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

export interface NavMenuRecord {
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
   * 子菜单是否组合
   */
  grouped?: boolean
  /**
   * 是否折叠
   */
  collapsed?: boolean
  /**
   * 子菜单
   */
  items?: NavMenuRecord[]
}
