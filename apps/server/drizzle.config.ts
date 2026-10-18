import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: '.drizzle',
  dialect: 'sqlite',
  schema: './src/schema',
  dbCredentials: {
    url: '.db/ebb.sqlite'
  }
})
