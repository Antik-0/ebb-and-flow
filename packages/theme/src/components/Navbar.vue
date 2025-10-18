<script setup lang='ts'>
import { AnimatePresence, motion } from 'motion-v'
import { computed } from 'vue'
import { useSharedMenus } from '#/controller/menus.ts'
import GlassMask from './GlassMask.vue'

defineProps<{
  showTitle?: boolean
}>()

const { currActiveNode } = useSharedMenus()

const title = computed(() => currActiveNode.value?.text ?? '')

const nodePath = computed(() => {
  let node = currActiveNode.value
  const paths: string[] = []
  while (node?.parent) {
    node = node.parent
    paths.push(node.text)
  }
  return paths.reverse().join('/')
})
</script>

<template>
  <div class="flex flex-center inset-x-0 top-0 fixed z-[--z-index-navbar]">
    <header class="h-[--navbar-height] max-w-320 w-full relative isolate">
      <div class="grid cols-[120px_1fr_120px] size-full">
        <slot name="start-action"></slot>

        <div class="col-[2/3] relative isolate">
          <motion.div
            :animate="showTitle ? 'hidden' : 'show'"
            class="flex flex-center inset-0 absolute z-20"
            :transition="{ duration: 0.6 }"
            :variants="{
              show: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0.8 }
            }"
          >
            <slot name="menu"></slot>
          </motion.div>

          <AnimatePresence>
            <motion.div
              v-show="showTitle"
              :animate="{ opacity: 1, x: 0 }"
              class="inset-0 absolute z-10"
              :exit="{ opacity: 0, x: 40 }"
              :initial="{ opacity: 0, x: 40 }"
              :transition="{
                type: 'spring',
                duration: 0.8
              }"
            >
              <div class="flex flex-col h-full justify-center">
                <span class="text-3 text-[--c-text-2] leading-4">
                  {{ nodePath }}
                </span>
                <h2 class="text-5 leading-7 truncate">
                  {{ title }}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <slot name="end-action"></slot>
      </div>
      <GlassMask class="inset-0 absolute -z-1" />
    </header>
  </div>
</template>
