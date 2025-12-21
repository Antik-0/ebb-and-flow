export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('render:html', html => {
    html.bodyAppend.push(`
    <div id="loading-mask">
      <img alt="loading" src="/loading.gif" />
    </div>
    `)
  })
})
