import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: '.drizzle',
  dialect: 'sqlite',
  schema: './apps/database/src/schema.ts',
  dbCredentials: {
    url: './apps/database/.data/ebb.sqlite'
  }
})
