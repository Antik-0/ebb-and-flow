import { motion } from 'motion/react'
import { useMemo, useRef } from 'react'

interface Props {
  text: string
  onMotionEnd?: () => void
}

export function FloatingText(props: Props) {
  const { text, onMotionEnd } = props

  const textList = useMemo(
    () => text.split('').map(s => (s === ' ' ? '\u00A0' : s)),
    [text]
  )

  const count = useRef(0)

  function onComplete() {
    count.current += 1
    if (count.current === textList.length) {
      onMotionEnd?.()
    }
  }

  return (
    <span className="inline-flex">
      {textList.map((value, index) => (
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 60 }}
          key={index}
          onAnimationComplete={onComplete}
          transition={{
            type: 'spring',
            duration: 1,
            delay: index * 0.05
          }}
        >
          {value}
        </motion.span>
      ))}
    </span>
  )
}
