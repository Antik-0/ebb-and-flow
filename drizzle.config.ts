import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: '.drizzle',
  dialect: 'sqlite',
  schema: './data/schema.ts',
  dbCredentials: {
    url: './data/.db/ebb.sqlite'
  }
})
