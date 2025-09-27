<script setup lang='ts'>
</script>

<template>
  <div class="pt-[--nav-height] flex-1 isolate">
    <div data-layout="doc">
      <div></div>
      <main class="content">
        <Content class="vp-doc px-32px" />
      </main>
      <div></div>
    </div>
  </div>
</template>

<style>
.content {
  padding: 32px 24px 96px;
  background-color: var(--content-bg-color);
}

@media (width >=960px) {
  [data-layout=doc] {
    padding: 24px 32px;
  }

  .content {
    border-radius: 20px;
  }
}

@media (width >=64rem) {
  .content {
    max-width: 64rem;
  }
}

@media (width >=1024px) {
  [data-layout=doc] {
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    gap: 20px;
  }

  .content {
    grid-column: 2 / 2;
  }
}
</style>
