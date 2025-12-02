<script setup lang='ts'>
import type { MenuItem } from '#/types'
import { shallowRef } from 'vue'
import Link from '#/components/Link.vue'

const props = defineProps<{
  items: MenuItem[]
}>()

interface Group {
  label?: string
  children: MenuItem[]
}

const groups = shallowRef<Group[]>(buildGroups())

function buildGroups() {
  const items = props.items ?? []

  const groupMap: Group[] = []
  let group: MenuItem[] = []

  for (const item of items) {
    if (item.items) {
      group.length && groupMap.push({ children: group })
      groupMap.push({ label: item.text, children: item.items })
      group = []
    } else {
      group.push(item)
    }
  }
  group.length && groupMap.push({ children: group })
  return groupMap
}
</script>

<template>
  <div class="p-6">
    <div v-for="(group, index) in groups" :key="index" :class="{ 'mt-4': index !== 0 }">
      <div
        v-if="group.label"
        class="text-14px text-brand-1 leading-8 font-600 mb-3"
      >
        {{ group.label }}
      </div>
      <section
        class="gap-4 grid"
      >
        <Link
          v-for="item in group.children"
          :key="item.text"
          :href="item.link"
        >
          <span
            :class="[
              'text-[--c-text-1] p-3 rounded-2 block',
              'transition-colors duration-250 ease',
              'hover:(text-brand-3 bg-brand-3/20)',
            ]"
          >
            <span class="text-14px text-nowrap">{{ item.text }}</span>
          </span>
        </Link>
      </section>
    </div>
  </div>
</template>
