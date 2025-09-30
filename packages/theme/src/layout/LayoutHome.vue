<script setup lang="ts">
import { useData, useRouter, withBase } from 'vitepress'
import { ref } from 'vue'
import FloatingText from '#/components/FloatingText.vue'
import FlowingLight from '#/components/FlowingLight.vue'
import SkillCoding from '#/components/SkillCoding.vue'
import { Power } from '#/icons'

const { frontmatter } = useData()

const showTitle = ref(false)
const showTagline = ref(false)

const router = useRouter()
function enter() {
  router.go(withBase(frontmatter.value.entryLink))
}
</script>

<template>
  <div class="flex-col h-screen w-screen">
    <div class="px-10 pb-60px pt-200px flex-col items-center lg:pt-200px">
      <div class="size-200px cursor-pointer relative isolate">
        <div class="avatar-bg"></div>
        <div class="avatar-mask"></div>
        <div class="rounded-full inset-0 absolute z-20 overflow-hidden">
          <img alt="site owner avatar" src="@/EAF-avatar.png" />
        </div>
      </div>

      <h1 class="mt-5 py-8 text-center w-full">
        <span
          class="site-owner"
          :data-fade-in="showTitle"
          @animationend="showTitle = true"
        >
          {{ frontmatter.author }}
        </span>
      </h1>

      <h2 class="text-6 mb-8 p-4">
        <div
          class="tagline flex-col gap-1 items-center"
          :data-fade-in="showTagline"
        >
          <FloatingText
            :text="frontmatter.tagline"
            @complete="showTagline = true"
          />
          <SkillCoding :skills="frontmatter.skills" />
        </div>
      </h2>

      <button
        aria-label="entry"
        class="entry-button"
        type="button"
        @click="enter"
      >
        <FlowingLight />
        <Power class="text-44px" />
      </button>
    </div>

    <div class="inset-0 fixed -z-1">
      <div class="tidewater"></div>
    </div>
  </div>
</template>

<style scoped>
.avatar-bg {
  position: absolute;
  inset: 0;
  z-index: 10;
  border-radius: 50%;
  background: linear-gradient(45deg, #00dc82, #36e4da, #0047e1);
  filter: blur(80px);
  animation: breathing 6s ease-in-out infinite;
}

.avatar-mask {
  position: absolute;
  inset: 0;
  z-index: 30;
  border-radius: 50%;
  box-shadow: inset 0 0 40px 0px hsl(175 78% 90% / 0.4),
              inset 0 10px 20px 0px hsl(175 78% 80% / 0.8),
              0 2px 10px 1px hsl(175 30% 40% / 0.8);
}

.site-owner {
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
  animation: site-owner-tide 1s ease-out 2 alternate;
}

.site-owner[data-fade-in='true'] {
  animation: site-owner-fade-in 2s ease-in;
}

.tagline {
  --m-color: #b9e4f8;

  font-weight: 600;
  line-height: 2;
  color: var(--m-color);
}

.tagline[data-fade-in='true'] {
  --m-color: #12998d;
  --rounded: 999px;

  color: transparent;
  background: linear-gradient(to right, var(--m-color) 40%, #b9e4f8);
  background-clip: text;
  transition: --m-color 600ms ease-in;
}

.entry-button {
  --m-color: transparent;
   --rounded: 999px;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: var(--rounded);
  color: #12998d;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 8px 1px var(--m-color);
  transition: --m-color 250ms ease-in;

  svg {
    animation: breathing 6s ease-in-out  infinite  ;
  }
}

.entry-button:hover {
  --m-color: #12998d;

  svg {
    animation-play-state: paused;
  }
}

.tidewater {
  position: absolute;
  top: 50%;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle,
      hsl(183 30% 75% / 0.1) 20%,
      transparent 80%);
  animation: tidewater 6s ease-in-out infinite;
}

</style>
