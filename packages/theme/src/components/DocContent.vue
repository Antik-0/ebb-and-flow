<script setup lang='ts'>
import AsideOutline from './AsideOutline.vue'
</script>

<template>
  <div class="pt-[--nav-height] flex-1 isolate">
    <div data-layout="doc">
      <main id="content" class="content">
        <Content class="vp-doc px-32px flex-1 min-w-0" />
        <AsideOutline v-if="false" />
      </main>
    </div>
  </div>
</template>

<style>
.content {
  display: flex;
  gap: 20px;
  width: 100%;
  min-width: 0;
  max-width: 80rem;
  padding: 32px 24px 96px;
  background-color: var(--content-bg-color);
}

[data-layout=doc] {
  display: flex;
  justify-content: center;
}

@media (width >= 960px) {
  [data-layout=doc] {
    padding: 24px 32px;
  }

  .content {
    border-radius: 20px;
  }
}
</style>
