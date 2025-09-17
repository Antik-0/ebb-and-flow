<script setup lang='ts'>
import { ref } from 'vue'
import { useSidebarControl } from '#/controller/sidebar.ts'
import MenuBook from './icons/MenuBook.vue'
import Search from './icons/Search.vue'
import NavAvatar from './widgets/Avatar.vue'
import Hamburger from './widgets/Hamburger.vue'

const { open } = useSidebarControl()

const menuOpen = ref(false)
</script>

<template>
  <header class="h-[--eaf-nav-height] inset-x-0 top-0 fixed z-[--eaf-z-index-nav]">
    <div class="bg-[--eaf-nav-bg-color] size-full">
      <div class="flex-center flex inset-0 absolute">
        <NavAvatar />
      </div>
      <div class="px-5 flex inset-0 justify-between absolute">
        <button
          aria-label="search-button"
          class="text-6 text-rose-500 px-3 cursor-pointer"
          type="button"
          @click="open"
        >
          <MenuBook />
        </button>

        <div class="text-rose-500 flex gap-2 justify-end">
          <button aria-label="search-button" class="text-6 px-3 cursor-pointer" type="button">
            <Search />
          </button>
          <Hamburger v-model="menuOpen" />
        </div>
      </div>
    </div>
  </header>
</template>
