import { createSource } from 'ebb-markdown'

await createSource({
  dir: '../../docs',
  output: '.data'
})
