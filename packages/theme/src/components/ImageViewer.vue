<script setup lang='ts'>
import { useAnimation } from '@repo/utils/hooks'
import {
  nextTick,
  onBeforeMount,
  onMounted,
  shallowRef,
  useTemplateRef
} from 'vue'

let controller: AbortController | null = null

function removeImageEvent() {
  controller?.abort()
}

const show = shallowRef(false)
const previewURL = shallowRef()
const triggerDOM = shallowRef<HTMLImageElement>()
const pictureDOM = useTemplateRef('picture')

const [enterAnimation] = useAnimation(null, {
  target: pictureDOM,
  duration: 400,
  easing: 'ease-in-out'
})

const [leaveAnimation] = useAnimation([{ opacity: '0' }], {
  target: pictureDOM,
  duration: 400,
  easing: 'ease-in-out'
})

async function handleOpen() {
  if (leaveAnimation.isRunning) return
  show.value = true
  triggerDOM.value?.setAttribute('data-hidden', 'true')
  await nextTick()
  enterAnimation.play()
}

async function handleClose() {
  if (leaveAnimation.isRunning) return
  leaveAnimation.play()
  await leaveAnimation.finished
  show.value = false
  triggerDOM.value?.removeAttribute('data-hidden')
}

function handlePreview(event: MouseEvent) {
  const image = event.target as HTMLImageElement
  triggerDOM.value = image
  previewURL.value = image.src

  const { scaleX, scaleY, offsetX, offsetY } = computeEffectState(image)
  enterAnimation.effect?.setKeyframes([
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

onMounted(() => {
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

onBeforeMount(() => {
  removeImageEvent()
})
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
