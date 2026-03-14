import { createSource } from 'ebb-markdown'

await createSource({
  dir: './src',
  output: '.data'
})
