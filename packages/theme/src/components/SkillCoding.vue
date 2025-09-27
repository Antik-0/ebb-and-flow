<script setup lang='ts'>
import { useInterval } from '@repo/utils/hooks'
import { shallowRef } from 'vue'
import { useCodingMotion } from '#/shared/useCoding'

const props = defineProps<{
  skills: string[]
}>()

const { coding } = useCodingMotion(props.skills, { prefix: '<', suffix: '/>' })

const spinner = shallowRef('/')
const spinnerState = ['|', '/', '-', '\\', '|', '/', '-', '\\']
let spinnerIndex = 0

useInterval(() => {
  spinnerIndex = (spinnerIndex + 1) % spinnerState.length
  spinner.value = spinnerState[spinnerIndex]!
}, 200)
</script>

<template>
  <span class="text-[--c-brand-3] font-mono px-2 rounded-lg bg-zinc-600/40 inline-flex contain-content items-center">
    {{ coding }}
    <span class="text-white">{{ spinner }}</span>
  </span>
</template>
