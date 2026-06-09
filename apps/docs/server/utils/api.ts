import { ebbEnv } from 'ebb-env'

const baseURL = `${ebbEnv.EBB_SERVER_BASE_URL}:${ebbEnv.EBB_SERVER_PORT}`

export function $api(input: string, options: RequestInit) {
  const url = new URL(input, baseURL)
  return fetch(url, options)
}
