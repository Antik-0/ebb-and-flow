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
  <div class="flex-col h-screen w-screen">
    <div class="px-10 pb-60px pt-120px flex-col items-center lg:pt-200px">
      <div class="avatar">
        <div class="avatar-bg"></div>
        <img
          alt="avatar"
          class="rounded-full inset-0 absolute z-20"
          src="@/EAF-avatar.png"
        />
      </div>

      <h1 class="name">{{ cover.name }}</h1>
      <p class="tagline">{{ cover.tagline }}</p>
    </div>

    <div class="h-1px relative">
      <button class="entry-button" type="button" @click="handleEnter">
        点击进入
      </button>
    </div>

    <div class="inset-0 fixed -z-1">
      <div class="tidewater"></div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  position: relative;
  width: 160px;
  height: 160px;
}

.avatar-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.4;
  background: linear-gradient(45deg, #00dc82, #36e4da, #0047e1);
  filter: blur(60px);
  z-index: 10;
  transition: opacity 1s ease-in-out;
}

.avatar:hover .avatar-bg {
  opacity: 1;
}

.name {
  margin: 0 0 -20px;
  padding: 32px 0;
  width: 360px;
  font-size: 48px;
  line-height: 60px;
  font-weight: 600;
  text-align: center;
  color: transparent;
  background: linear-gradient(135deg, #1c4c5f, #e3f6ff);
  background-clip: text;
}

.tagline {
  margin: 0 auto;
  padding: 12px 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 2;
  text-align: center;
  color: transparent;
  opacity: 0;
  background: linear-gradient(90deg, #1c4c5f 50%, #a8a8b6 80%, #e3f6ff);
  background-size: 200% 100%;
  background-clip: text;
  background-repeat: no-repeat;
  animation: fade-in 4s ease-in-out forwards;
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
  animation: bounce 1.4s ease-in-out infinite;
  animation-delay: 1s;
  cursor: pointer;
}

.entry-button:hover {
  box-shadow:
    inset 0 0 4px 1px #56b3ab,
    0 0 8px 1px #12998d;
  animation-play-state: paused;
}

.tidewater {
  position: absolute;
  top: 50%;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(
    circle,
    hsl(183 30% 75% / 0.1) 20%,
    transparent 80%
  );
  animation: tidewater 6s ease-in-out infinite;
}
</style>

<style>
@keyframes fade-in {
  from {
    opacity: 1;
    background-position: 200% 100%;
  }

  to {
    opacity: 1;
    background-position: 100% 100%;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  50% {
    transform: translateX(-50%) translateY(-40px);
  }
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
