import type { FC, ReactNode, RefObject } from 'react'
import type { MenuItem, WithHTMLProps } from '../types'
import {
  createContext,
  createElement,
  useContext,
  useRef,
  useState
} from 'react'

export interface ContentView {
  item: MenuItem
  render: () => ReactNode
}

export function useMenuViewControl() {
  const [visible, setVisible] = useState(false)
  const [prevHoverIndex, setPrevHoverIndex] = useState(-1)
  const [currHoverIndex, setCurrHoverIndex] = useState(-1)

  const contentViews = useRef<ContentView[]>([])

  function onMouseenter() {
    setVisible(true)
  }

  function onMouseleave() {
    setVisible(false)
  }

  function onMenuItemHover(index: number) {
    setPrevHoverIndex(currHoverIndex)
    setCurrHoverIndex(index)
  }

  function forwardContent(item: MenuItem, render: () => ReactNode) {
    contentViews.current.push({ item, render })
  }

  return {
    visible,
    prevHoverIndex,
    currHoverIndex,
    contentViews,
    onMouseenter,
    onMouseleave,
    onMenuItemHover,
    forwardContent
  }
}

interface ContentRenderProps extends WithHTMLProps {
  render: () => ReactNode
}

export const ContentRender: FC<ContentRenderProps> = props => {
  const { render, ...restProps } = props
  return createElement('div', restProps, render())
}

interface MenubarContext {
  offsetX: number
  showViewport: boolean
  contentViews: RefObject<ContentView[]>
  prevHoverIndex: number
  currHoverIndex: number
  forwardContent: (item: MenuItem, render: () => ReactNode) => void
}

export const MenubarContext = createContext({} as MenubarContext)

export function useMenubarCtx() {
  return useContext(MenubarContext)
}
