import { motion } from 'motion-v'
import { computed, defineComponent } from 'vue'

export const FloatingText = defineComponent<
  { text: string },
  { motionEnd: () => void }
>(
  (props, { emit }) => {
    const textList = computed(() =>
      props.text.split('').map(s => (s === ' ' ? '\u00A0' : s))
    )

    let count = 0
    function onComplete() {
      count += 1
      if (count === textList.value.length) {
        emit('motionEnd')
      }
    }

    return () => (
      <span class="inline-flex">
        {textList.value.map((text, index) => (
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
            {text}
          </motion.span>
        ))}
      </span>
    )
  },
  { name: 'FloatingText', props: ['text'], emits: ['motionEnd'] }
)
