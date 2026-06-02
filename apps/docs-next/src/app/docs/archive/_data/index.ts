import { getArchive } from '#db'

export async function getArchiveData() {
  const data = await getArchive()
  return data
}
