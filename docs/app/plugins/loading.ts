export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:beforeMount', () => {
    const loadingMask = document.getElementById('loading-mask')
    loadingMask?.remove()
  })
})
