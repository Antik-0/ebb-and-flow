<script setup lang='ts'>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="px-8 py-24 text-center w-full">
    <p class="text-16 leading-[1] font-600">404</p>
    <h1 class="text-5 leading-[2] tracking-2px font-700 pt-5">页面未找到</h1>
    <div class="mx-auto my-6 bg-divider h-px w-16"></div>
    <blockquote class="text-14px text-[--c-text-2] leading-[2] font-500 mx-auto max-w-64">
      但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。
    </blockquote>
    <div class="pt-5">
      <a
        aria-label="go to home"
        class="text-14px text-brand font-500 px-4 py-1 border border-brand rounded-4 inline-flex"
        :href="withBase('/')"
      >
        带我回首页
      </a>
    </div>
  </div>
</template>
