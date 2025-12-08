import { CodeGroup, CustomBlock } from '@repo/theme/prose'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp
    .component('CustomBlock', CustomBlock)
    .component('CodeGroup', CodeGroup)
})
