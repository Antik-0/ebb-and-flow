import { CodeGroup, CustomBlock } from 'ebb-theme/prose'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp
    .component('CustomBlock', CustomBlock)
    .component('CodeGroup', CodeGroup)
})
