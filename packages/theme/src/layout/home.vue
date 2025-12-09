<script setup lang='ts'>
import { usePageTitle } from '@repo/utils/hooks'
import { useRouter } from 'nuxt/app'
import { shallowRef } from 'vue'
import CodeMotion from '#/components/CodeMotion.vue'
import CubeAvatar from '#/components/CubeAvatar.vue'
import FloatingText from '#/components/FloatingText.vue'
import MoonAvatar from '#/components/MoonAvatar.vue'
import { Power } from '#/icons'
import { useTheme } from '#/useTheme'

defineOptions({ name: 'LayoutHome' })

const { theme } = useTheme()

usePageTitle(theme.title)

const titleAnimating = shallowRef(true)
const taglineMotion = shallowRef('')

const router = useRouter()
function handleEnter() {
  router.push(theme.defaultActiveLink)
}
</script>

<template>
  <div class="flex-col h-screen w-screen isolate">
    <div class="px-10 pb-60px pt-160px flex-col flex-1 items-center">
      <MoonAvatar :avatar="theme.avatar" />

      <h1 class="mt-4 py-8 text-center w-full">
        <span
          class="site-title"
          :data-animating="titleAnimating"
          @animationend="titleAnimating = false"
        >
          {{ theme.author }}
        </span>
      </h1>

      <h2 class="text-6 py-4">
        <p
          class="tagline flex gap-2 items-center"
          :data-motion="taglineMotion"
        >
          <FloatingText
            :text="theme.tagline"
            @motion-end="taglineMotion = 'fade'"
          />
          <CodeMotion
            :codes="theme.codes"
            :paused="taglineMotion !== 'fade'"
            cycle
          />
        </p>
      </h2>

      <div class="h-20 w-full"></div>

      <div
        class="cube-motion flex flex-center relative isolate"
        @click="handleEnter"
      >
        <CubeAvatar :avatar="theme.avatar" />

        <div class="entry-button">
          <button
            aria-label="entry"
            class="text-teal p-3 rounded-999 bg-black/10 flex cursor-pointer flex-center"
            type="button"
          >
            <Power class="text-10" />
          </button>
          <div aria-hidden="true" class="entry-background"></div>
        </div>
      </div>
    </div>

    <div class="flex items-end inset-0 fixed -z-1">
      <div class="tidewater"></div>
    </div>
  </div>
</template>

<style>
.site-title {
  display: inline-flex;
  font-size: 48px;
  line-height: 60px;
  font-weight: 600;
  letter-spacing: 10px;
  color: transparent;
  background-image: linear-gradient(135deg, #12998d, #d5e6ff);
  background-size: cover;
  background-clip: text;
}

.site-title[data-animating='true'] {
  --value-u-to: 120px;
  clip-path: circle(var(--m-value-u) at center);
  animation: motion-value-u 2s ease-out;
}

.tagline {
  --m-color: #b9e4f8;
  font-weight: 600;
  line-height: 2;
  color: var(--m-color);
}

.tagline[data-motion='fade'] {
  --m-color: #12998d;
  color: transparent;
  background: linear-gradient(to right, var(--m-color) 10%, #b9e4f8);
  background-clip: text;
  transition: --m-color 600ms ease-out;
}

.entry-button {
  --value-u-to: -25%;
  position: absolute;
  z-index: -1;
  translate: 0 var(--m-value-u);
  transition: transform 400ms ease-out;
  animation: motion-value-u 1s linear infinite alternate;
}

.entry-background {
  position: absolute;
  inset: 10px;
  z-index: -1;
  border-radius: 999px;
  box-shadow: 0 0 16px 2px #12998d;
  opacity: var(--m-opacity);
  animation: motion-opacity 2s infinite alternate;
}

.cube-motion:hover {
  .cube-face {
    --m-value-u: 100px;
  }

  .cube-face[data-state='top'] {
    opacity: 0;
  }

  .entry-button {
    animation-play-state: paused;
    transform: translateY(-90px);
  }

  svg {
    rotate: y var(--m-angle);
    animation: motion-angle 2s linear infinite;
  }
}

.tidewater {
  --value-to: 1.6;
  width: 100vw;
  height: 50vh;
  background: radial-gradient(
    circle,
    hsl(183 30% 75% / 0.1) 20%,
    transparent 80%
  );
  transform-origin: bottom center;
  scale: 1 var(--m-value);
  animation: motion-value 3s infinite alternate;
  animation-timing-function: cubic-bezier(0.4, -0.4, 0.36, 1);
}
</style>
