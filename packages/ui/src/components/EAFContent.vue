<script setup lang='ts'>
</script>

<template>
  <div class="pt-[--nav-height] flex-1 isolate">
    <div data-layout="doc">
      <main class="content">
        <Content class="vp-doc px-32px" />
      </main>
    </div>
  </div>
</template>

<style>
[data-layout=doc] {
  display: flex;
}

.content {
  width: 100%;
  padding: 32px 24px 96px;
  background-color: var(--content-bg-color);
}

@media (width >= 960px) {
  [data-layout=doc] {
    padding: 24px 32px;
  }

  .content {
    border-radius: 20px;
  }
}

@media (width >= 1024px) {
  [data-layout=doc] {
    justify-content: center;
  }

  .content {
    max-width: 80rem;
  }
}
</style>
