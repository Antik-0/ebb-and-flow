import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: '.drizzle',
  dialect: 'sqlite',
  schema: 'apps/server/src/schema.ts',
  dbCredentials: {
    url: '.db/ebb.sqlite'
  }
})
