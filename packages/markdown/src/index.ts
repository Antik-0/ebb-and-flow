import { fileURLToPath, URL } from 'node:url'
import { rehypePatch } from './rehype/patch.ts'
import { remarkComponent } from './remark/component.ts'
import { remarkFrontmatter } from './remark/frontmatter.ts'
import { remarkMetadata } from './remark/metadata.ts'
import { remarkToRehype } from './remark/to-hast.ts'
import { createUnified } from './unified.ts'

const file = Bun.file(fileURLToPath(new URL('./test.md', import.meta.url)))

const content = await file.text()

const unified = createUnified()
unified
  .use([remarkComponent])
  .use([remarkFrontmatter])
  .use([remarkMetadata])
  .use([remarkToRehype])
  .use([rehypePatch])
  .process({ path: file.name, value: content })
