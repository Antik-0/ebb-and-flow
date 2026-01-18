import { useEffect, useRef, useState } from 'react'
import { useMenuActiveNode } from '../controller/menus'
import { useAnimation } from '../hooks'

export function ImageViewer() {
  const activeNode = useMenuActiveNode()
  const [previewURL, setPreviewURL] = useState('')

  const viewerDOM = useRef<HTMLDivElement | null>(null)
  const triggerDOM = useRef<HTMLImageElement | null>(null)
  const pictureDOM = useRef<HTMLPictureElement | null>(null)

  const [enterAnimation] = useAnimation(null, {
    target: () => pictureDOM.current,
    duration: 400,
    easing: 'ease-in-out'
  })

  const [leaveAnimation] = useAnimation([{ opacity: '0' }], {
    target: () => pictureDOM.current,
    duration: 400,
    easing: 'ease-in-out'
  })

  function handleOpen() {
    if (leaveAnimation.isRunning) return
    viewerDOM.current?.style.removeProperty('display')
    triggerDOM.current?.setAttribute('data-hidden', 'true')
    enterAnimation.play()
  }

  async function handleClose() {
    if (leaveAnimation.isRunning) return
    leaveAnimation.play()
    await leaveAnimation.finished
    viewerDOM.current?.style.setProperty('display', 'none')
    triggerDOM.current?.removeAttribute('data-hidden')
  }

  function handlePreview(event: MouseEvent) {
    const image = event.target as HTMLImageElement
    triggerDOM.current = image
    setPreviewURL(image.src)

    const { scaleX, scaleY, offsetX, offsetY } = computeEffectState(image)
    enterAnimation.effect?.setKeyframes([
      {
        translate: `${offsetX}px ${offsetY}px`,
        scale: `${scaleX} ${scaleY}`
      },
      { translate: '0 0', scale: '1 1' }
    ])

    handleOpen()
  }

  useEffect(() => {
    const container = document.getElementById('ebb-content')
    const imageList = container?.querySelectorAll('img') ?? []

    const controller = new AbortController()
    for (const element of imageList) {
      element.addEventListener('click', handlePreview, {
        signal: controller.signal
      })
      element.classList.add('motion-image')
    }

    return () => controller.abort()
  }, [activeNode])

  return (
    <div
      className="bg-black/40 grid contain-paint inset-0 place-content-center place-items-center fixed z-100"
      onClick={handleClose}
      ref={viewerDOM}
      style={{ display: 'none' }}
    >
      <picture className="max-h-full max-w-full" ref={pictureDOM}>
        {previewURL && (
          <img alt="preview" className="size-full" src={previewURL} />
        )}
      </picture>
    </div>
  )
}

function computeEffectState(image: HTMLImageElement) {
  const { naturalWidth, naturalHeight } = image
  const { clientWidth, clientHeight } = document.documentElement
  const rect = image.getBoundingClientRect()

  const ratio = naturalWidth / naturalHeight

  let scaleW = Math.min(naturalWidth, clientWidth)
  let scaleH = scaleW / ratio
  if (scaleH > clientHeight) {
    scaleH = clientHeight
    scaleW = clientHeight * ratio
  }
  // 计算缩小比例
  const scaleX = rect.width / scaleW
  const scaleY = rect.height / scaleH

  // 计算偏移位置
  const offsetX = rect.left + (rect.width - clientWidth) / 2
  const offsetY = rect.top + (rect.height - clientHeight) / 2

  return {
    scaleX,
    scaleY,
    offsetX,
    offsetY
  }
}
