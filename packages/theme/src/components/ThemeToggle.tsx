import { motion } from 'motion-v'
import { defineComponent } from 'vue'
import { ThemeDark, ThemeLight } from '#/icons'
import { useAppTheme } from '#/theme'

export default defineComponent(
  () => {
    const { theme, toggleTheme } = useAppTheme()

    return () => {
      const isDark = theme.value === 'dark'
      return (
        <motion.button
          aria-checked={isDark}
          aria-label="toggle theme"
          class="flex w-12 cursor-pointer items-center rounded-4 border border-divider bg-[--c-bg-mutate]/20 p-0.5 text-5"
          data-state={isDark ? 'dark' : 'light'}
          onClick={toggleTheme}
          role="switch"
          style={{ justifyContent: isDark ? 'flex-end' : 'flex-start' }}
          type="button"
        >
          <motion.span
            layout
            transition={{ type: 'spring', visualDuration: 0.6 }}
          >
            {isDark ? <ThemeDark /> : <ThemeLight />}
          </motion.span>
        </motion.button>
      )
    }
  },
  { name: 'ThemeToggle' }
)
