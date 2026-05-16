const expiredDate = 1000 * 60 * 60 * 24 * 360

export default defineEventHandler(event => {
  const theme = getCookie(event, 'theme')

  setCookie(event, 'theme', theme ?? 'dark', {
    path: '/',
    expires: new Date(Date.now() + expiredDate),
    secure: true,
    sameSite: 'lax'
  })
})
