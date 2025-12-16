<script setup lang='ts'>
import { computed } from 'vue'
import { useSharedMenus } from '#/controller/menus.ts'
import Link from '../Link.vue'

const { currActiveNode } = useSharedMenus()

const prevNav = computed(() => currActiveNode.value?.prevNav)
const nextNav = computed(() => currActiveNode.value?.nextNav)
</script>

<template>
  <footer class="mt-16">
    <div class="bg-divider h-px"></div>

    <nav aria-label="pager" class="pt-6 gap-4 grid grid-cols-1 sm:grid-cols-2">
      <div
        v-if="prevNav"
        class="border border-divider rounded-2 transition-colors duration-250 hover:border-brand-2"
      >
        <Link
          class="px-4 py-3 flex-col"
          :href="prevNav.link"
        >
          <span class="text-12px text-muted-foreground leading-20px">
            上一页
          </span>
          <span class="text-14px text-brand-2 leading-20px">
            {{ prevNav.text }}
          </span>
        </Link>
      </div>
      <div
        v-if="nextNav"
        class="border border-divider rounded-2 transition-colors duration-250 hover:border-brand-2 sm:col-2"
      >
        <Link

          class="px-4 py-3 text-right flex-col"
          :href="nextNav.link"
        >
          <span class="text-12px text-muted-foreground leading-20px">
            下一页
          </span>
          <span class="text-14px text-brand-2 leading-20px">
            {{ nextNav.text }}
          </span>
        </Link>
      </div>
    </nav>
  </footer>
</template>
