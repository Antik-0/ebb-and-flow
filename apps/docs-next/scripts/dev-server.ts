import { buildMDXSource } from '@ebb/mdx/source'

const { compile } = await buildMDXSource({ mode: 'dev' })
