import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        tags: z.array(z.string()).optional(),
        readingTime: z.number().optional(),
        lastUpdated: z.number().optional()
      })
    })
  }
})
