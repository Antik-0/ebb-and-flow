import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onWatcherCleanup,
  shallowRef,
  useTemplateRef,
  watch
} from 'vue'
import { lockScrollbar, unlockScrollbar, usePage } from '#/controller/layout'
import { useAnimation } from '#/hooks'

export default defineComponent(
  () => {
    let controller: AbortController | null = null

    function removeImageClickEvent() {
      controller?.abort()
    }

    const show = shallowRef(false)
    const previewURL = shallowRef()
    const triggerDOM = shallowRef<HTMLImageElement>()
    const pictureDOM = useTemplateRef<HTMLPictureElement>('picture')

    const [enterAnimation] = useAnimation(null, {
      target: pictureDOM,
      duration: 400,
      easing: 'ease-out'
    })

    const [leaveAnimation] = useAnimation([{ opacity: '0' }], {
      target: pictureDOM,
      duration: 400,
      easing: 'ease-out'
    })

    async function handleOpen() {
      if (leaveAnimation.isRunning) return
      show.value = true
      triggerDOM.value?.setAttribute('data-hidden', 'true')
      await nextTick()
      enterAnimation.play()
      lockScrollbar()
    }

    async function handleClose() {
      if (leaveAnimation.isRunning) return
      leaveAnimation.play()
      await leaveAnimation.finished
      show.value = false
      triggerDOM.value?.removeAttribute('data-hidden')
      unlockScrollbar()
    }

    function handlePreview(event: MouseEvent) {
      const image = event.target as HTMLImageElement
      triggerDOM.value = image
      previewURL.value = image.src

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

    function bindImageClickEvent() {
      const container = document.getElementById('content')
      const imageList =
        container?.querySelectorAll<HTMLImageElement>('.motion-image') ?? []

      controller = new AbortController()
      for (const image of imageList) {
        image.addEventListener('click', handlePreview, {
          signal: controller.signal
        })
      }
    }

    const { page } = usePage()

    onMounted(() => {
      watch(
        () => page.value,
        () => {
          bindImageClickEvent()
          onWatcherCleanup(() => {
            removeImageClickEvent()
            unlockScrollbar()
          })
        },
        { immediate: true, flush: 'post' }
      )
    })

    onBeforeUnmount(() => {
      removeImageClickEvent()
      unlockScrollbar()
    })

    return () => (
      <div
        class="fixed inset-0 z-100 grid place-content-center place-items-center bg-black/40 contain-paint"
        data-role="imageviewer"
        onClick={handleClose}
        v-show={show.value}
      >
        <picture class="max-h-full max-w-full" ref="picture">
          <img alt="preview img" class="size-full" src={previewURL.value} />
        </picture>
      </div>
    )
  },
  { name: 'ImageViewer' }
)

function computeEffectState(image: HTMLImageElement) {
  const { clientWidth, clientHeight } = document.documentElement
  const { naturalWidth, naturalHeight } = image
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
