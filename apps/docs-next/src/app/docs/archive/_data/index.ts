interface Archive {
  id: number
  path: string
  title: string
  lastUpdated: number
  cover: string
  tags: string[]
}

export async function getArchive() {
  const res = await fetch('http://localhost:8080/archive', { method: 'GET' })
  return (await res.json()) as Archive[]
}
