<script setup lang='ts'>
import { useAnimation } from '@repo/utils/hooks'
import { useData } from 'vitepress'
import {
  nextTick,
  onBeforeMount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watchEffect
} from 'vue'

let controller: AbortController | null = null

function removeImageEvent() {
  controller?.abort()
}

const show = shallowRef(false)
const previewURL = shallowRef()
const triggerDOM = shallowRef<HTMLImageElement>()
const pictureDOM = useTemplateRef('picture')

async function handlePreview(event: MouseEvent) {
  const image = event.target as HTMLImageElement
  triggerDOM.value = image
  previewURL.value = image.src

  const { scaleX, scaleY, offsetX, offsetY } = computeEffectState(image)
  enterEffect.value.setKeyframes([
    { translate: `${offsetX}px ${offsetY}px`, scale: `${scaleX} ${scaleY}` },
    { translate: '0 0', scale: '1 1' }
  ])

  handleOpen()
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

const { frontmatter } = useData()

onMounted(() => {
  watchEffect(() => {
    removeImageEvent()

    const { imageViewerOpen = true } = frontmatter.value
    if (imageViewerOpen === false) return

    const container = document.getElementById('content')
    const imageList = container?.querySelectorAll('img') ?? []

    controller = new AbortController()
    for (const element of imageList) {
      element.addEventListener('click', handlePreview, {
        signal: controller.signal
      })
      element.classList.add('motion-image')
    }
  })
})

onBeforeMount(() => {
  removeImageEvent()
})

const effectOption: KeyframeEffectOptions = {
  duration: 400,
  easing: 'ease-in-out'
}

const [enterAnimation, enterEffect] = useAnimation(
  pictureDOM,
  null,
  effectOption
)

const [leaveAnimation] = useAnimation(
  pictureDOM,
  [{ opacity: '1' }, { opacity: '0' }],
  effectOption,
  {
    onFinish() {
      show.value = false
      triggerDOM.value?.removeAttribute('data-hidden')
    }
  }
)

async function handleOpen() {
  show.value = true
  triggerDOM.value?.setAttribute('data-hidden', 'true')
  await nextTick()
  enterAnimation.value.play()
}

function handleClose() {
  leaveAnimation.value.play()
}
</script>

<template>
  <div
    v-show="show"
    class="bg-black/40 grid contain-paint inset-0 place-content-center place-items-center fixed z-100"
    @click="handleClose"
  >
    <picture ref="picture" class="max-h-full max-w-full">
      <img alt="preview image" class="size-full" :src="previewURL" />
    </picture>
  </div>
</template>
