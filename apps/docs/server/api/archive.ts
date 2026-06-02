import { getArchive } from '#db'

export default defineEventHandler(async () => {
  const data = await getArchive()
  return { data }
})
