<script setup lang='ts'>
import { navigateTo } from 'nuxt/app'
import { onMounted, ref } from 'vue'
import CodeMotion from '#/components/CodeMotion.vue'
import { CubeAvatar, MoonAvatar } from '#/components/Effect.tsx'
import FloatingText from '#/components/FloatingText.vue'
import { setHtmlLayout } from '#/controller/layout'
import { Power } from '#/icons'
import { useTheme } from '#/theme'

const { theme } = useTheme()

const titleMotion = ref('fade')
const taglineMotion = ref('')

function handleEnter() {
  navigateTo(theme.defaultActiveLink)
}

onMounted(() => setHtmlLayout('home'))
</script>

<template>
  <div class="home-page flex-col h-screen w-screen isolate">
    <div class="px-10 pb-20 pt-40 flex-col flex-1 items-center">
      <MoonAvatar :avatar="theme.avatar" />

      <h1 class="mt-4 py-8 text-center w-full">
        <span
          class="site-title"
          :data-motion="titleMotion"
          @animationend="titleMotion = 'flow'"
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
            class="text-teal p-3 rounded-full bg-black/10 flex cursor-pointer flex-center"
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
