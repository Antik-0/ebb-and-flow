<script setup lang="ts">
import { useData, useRouter, withBase } from 'vitepress'
import { computed } from 'vue'

const { frontmatter } = useData()
const cover = computed(() => frontmatter.value.cover)

const router = useRouter()
function handleEnter() {
  const entryLink = frontmatter.value.entryLink
  entryLink && router.go(withBase(entryLink))
}
</script>

<template>
  <div class="EAFHome">
    <div class="EAFHome-cover">
      <div class="avatar">
        <div class="avatar-bg"></div>
        <img alt="avatar" class="avatar-src" src="@/EAF-avatar.png" />
      </div>

      <h1 class="name">{{ cover.name }}</h1>
      <p class="tagline">{{ cover.tagline }}</p>
    </div>

    <div class="EAFHome-entry">
      <button class="entry-button" type="button" @click="handleEnter">
        点击进入
      </button>
    </div>

    <div class="EAFHome-tide">
      <div class="tidewater"></div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  position: relative;
  width: var(--EAF-cover-avatar-size);
  height: var(--EAF-cover-avatar-size);
}

.avatar-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.4;
  background: var(--EAF-cover-avatar-background);
  filter: blur(60px);
  z-index: 10;
  transition: all 1s ease-in;
}

.avatar:hover .avatar-bg {
  opacity: 1;
}

.avatar-src {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transition: all 1s ease-in;
  z-index: 20;
}

.avatar:hover .avatar-src {
  box-shadow: var(--EAF-cover-avatar-shadow--hover);
}

.name {
  margin: 0 0 -20px;
  padding: 32px 0;
  width: 360px;
  font-size: 48px;
  line-height: 60px;
  font-weight: 600;
  text-align: center;
  color: var(--EAF-cover-name-color);
  background: var(--EAF-cover-name-background);
  background-clip: text;
}

.tagline {
  margin: 0 auto;
  padding: 12px 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 2;
  text-align: center;
  color: var(--EAF-cover-tagline-color);
  opacity: 0;
  background: var(--EAF-cover-tagline-background);
  background-size: 200% 100%;
  background-clip: text;
  animation: var(--EAF-animation-tagline);
  animation-fill-mode: forwards;
  animation-delay: 400ms;
}

.entry-button {
  position: absolute;
  left: 50%;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  color: #12998d;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 8px 1px #12998d;
  transform: translateX(-50%);
  animation: var(--EAF-animation-entryButton);
  animation-delay: 1s;
  cursor: pointer;
}

.entry-button:hover {
  box-shadow:
    inset 0 0 4px 1px #56b3ab,
    0 0 8px 1px #12998d;
  animation-play-state: paused;
}
</style>
