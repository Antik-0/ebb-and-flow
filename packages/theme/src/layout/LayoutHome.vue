<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, shallowRef } from 'vue'
import FloatingText from '#/components/FloatingText.vue'
import SkillCoding from '#/components/SkillCoding.vue'
import Link from '#/core/Link.vue'
import { ArrowLeftToLine, ArrowRightToLine } from '#/icons'

const { frontmatter } = useData()

const skills = shallowRef(['TypeScript', 'The Vue', 'The React'])

const showAuthor = ref(false)
</script>

<template>
  <div class="flex-col h-screen w-screen">
    <div class="px-10 pb-60px pt-200px flex-col items-center lg:pt-200px">
      <div class="size-200px relative isolate">
        <div class="avatar-bg inset-0 absolute z-10"></div>
        <img alt="site owner avatar" class="avatar inset-0 absolute z-20" src="@/EAF-avatar.png" />
      </div>

      <h1 class="text-12 leading-60px py-8 text-center w-100" :class="{ author: showAuthor }">
        <FloatingText
          :text="frontmatter.author"
          @complete="showAuthor = true"
        />
      </h1>

      <h2 class="text-6 mb-8 p-4 text-center flex-col gap-1 items-center">
        <span class="tagline leading-[2] font-600">{{ frontmatter.tagline }}</span>
        <SkillCoding :skills="skills" />
      </h2>

      <Link class="entry-button" :href="frontmatter.entryLink" role="button">
        <span class="entry-btn__icon">
          <ArrowRightToLine />
        </span>
        <span class="px-2">点击进入</span>
        <span class="entry-btn__icon">
          <ArrowLeftToLine />
        </span>
      </Link>
    </div>

    <div class="inset-0 fixed -z-1">
      <div class="tidewater"></div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  border-radius: 50%;
  box-shadow: 0 8px 20px 0 #81aca9;
}

.avatar-bg {
  border-radius: 50%;
  background: linear-gradient(45deg, #00dc82, #36e4da, #0047e1);
  filter: blur(80px);
}

.author {
  color: transparent;
  background: linear-gradient(135deg, #1c4c5f, #e3f6ff);
  background-clip: text;
}

.tagline {
  color: transparent;
  background: linear-gradient(to right, #12998d 40%, #b9e4f8);
  background-clip: text;
}

.entry-button {
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 20px;
  color: #12998d;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 8px 1px #12998d;
  cursor: pointer;
}

.entry-button:hover {
  box-shadow: none;
  background-color: transparent;

  .entry-btn__icon {
    opacity: 1;
    translate: 0;
  }
}

.entry-btn__icon {
  opacity: 0;
  transition: all 250ms ease-in;
}

.entry-btn__icon:first-child {
  translate: -40px;
}

.entry-btn__icon:last-child {
  translate: 40px;
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

@keyframes tidewater {

  0%,
  10% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.6);
  }

  90%,
  100% {
    transform: scale(0);
  }
}
</style>
