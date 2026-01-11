import { clsx } from '@repo/utils'
import { motion } from 'motion/react'
import { useState } from 'react'
import { ThemeDark, ThemeLight } from '../icons'

export function ThemeToggle() {
  const [isDark, setDark] = useState(true)

  function toggle() {
    setDark(value => !value)
  }

  return (
    <motion.button
      aria-checked={isDark}
      aria-label="dark-toggle"
      className={clsx(
        'text-5 border border-divider bg-[--c-bg-mutate]/20',
        'p-0.5 rounded-4 flex w-12 cursor-pointer items-center'
      )}
      data-state={isDark ? 'dark' : 'light'}
      onClick={toggle}
      role="switch"
      style={{ justifyContent: isDark ? 'flex-end' : 'flex-start' }}
      type="button"
    >
      <motion.span
        layout
        transition={{
          type: 'spring',
          visualDuration: 0.8
        }}
      >
        {isDark ? <ThemeDark /> : <ThemeLight />}
      </motion.span>
    </motion.button>
  )
}
