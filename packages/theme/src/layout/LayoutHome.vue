<script setup lang="ts">
import { useData, useRouter, withBase } from 'vitepress'
import { shallowRef } from 'vue'
import CubeAvatar from '#/components/CubeAvatar.vue'
import FloatingText from '#/components/FloatingText.vue'
import MoonAvatar from '#/components/MoonAvatar.vue'
import SkillCoding from '#/components/SkillCoding.vue'
import { Power } from '#/icons'

defineProps<{
  avatar: string
}>()

const { frontmatter } = useData()

const titleMotion = shallowRef('tide')
const taglineMotion = shallowRef('')

const router = useRouter()
function handleEnter() {
  router.go(withBase(frontmatter.value.entryLink))
}
</script>

<template>
  <div class="flex-col h-screen w-screen isolate">
    <div class="px-10 pb-60px pt-160px flex-col flex-1 items-center">
      <MoonAvatar :avatar="avatar" />

      <h1 class="mt-4 py-8 text-center w-full">
        <span
          class="site-title"
          :data-motion="titleMotion"
          @animationend="titleMotion = 'fade'"
        >
          {{ frontmatter.author }}
        </span>
      </h1>

      <h2 class="text-6 mb-8 py-4">
        <p
          class="tagline flex gap-2 items-center"
          :data-motion="taglineMotion"
        >
          <FloatingText
            :text="frontmatter.tagline"
            @motion-end="taglineMotion = 'fade'"
          />
          <SkillCoding
            :paused="taglineMotion !== 'fade'"
            :skills="frontmatter.skills"
          />
        </p>
      </h2>

      <div class="relative animate-bounce isolate">
        <button
          aria-label="entry"
          :class="[
            'text-teal p-3 rounded-999 bg-black/10 opacity-60 flex cursor-pointer flex-center',
            'transition-opacity duration-200 hover:opacity-100'
          ]"
          type="button"
          @click="handleEnter"
        >
          <Power class="text-10" />
        </button>
        <div aria-hidden="true" class="entry-background"></div>
      </div>

      <CubeAvatar size="large" />
    </div>

    <div class="flex items-end inset-0 fixed -z-1">
      <div class="tidewater"></div>
    </div>
  </div>
</template>

<style>
.site-title {
  --length-from: -100%;
  --length-to: 0%;

  display: inline-flex;
  font-size: 48px;
  line-height: 60px;
  font-weight: 600;
  letter-spacing: 10px;
  color: transparent;
  background-image: linear-gradient(135deg, #12998d, #d5e6ff);
  background-clip: text;
  background-size: 100% 200%;
  background-repeat: no-repeat;
  background-position: 100% var(--m-length);
  animation: motion-length 2s ease-out 2 alternate;
}

.site-title[data-motion='fade'] {
  animation: title-fade 2s ease-out;
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

.entry-background {
  position: absolute;
  inset: 10px;
  z-index: -1;
  border-radius: 999px;
  box-shadow: 0 0 16px 2px #12998d;
  opacity: var(--m-opacity);
  animation: motion-opacity 2s infinite alternate;
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
}
</style>
