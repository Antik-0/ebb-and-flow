# 数字滚动

## demo

## source

::: code-group

```ts [useCount]
import { ref, toValue, computed } from 'vue'

interface Options {
  from: number
  to: number
  duration: number
  precision?: number
}

/**
 * 数值滚动动画
 */
export function useCount(options: Options) {
  const from = toValue(options.from)
  const to = toValue(options.to)

  // 精度：默认保留两位小数
  const precision = options.precision ?? 2

  const { duration } = options

  // 每 ms 的步进值
  const step = (to - from) / duration

  // 初始值，为了保留小数位，用字符串表示
  const count = ref(from.toFixed(precision))

  // 0-未开启，1-进行中，2-暂停，3-结束
  const state = ref(0)

  // 动画开始后经过的时间
  let sinceTimeStart = 0

  // 上次动画开始的时间戳
  let lastTimeStamp: DOMHighResTimeStamp | null = null

  // 动画函数
  function core(time: DOMHighResTimeStamp) {
    if (state.value !== 1) {
      return
    }

    if (lastTimeStamp === null) {
      lastTimeStamp = time
    }
    sinceTimeStart += time - lastTimeStamp

    if (sinceTimeStart >= duration) {
      count.value = to.toFixed(precision)
      state.value = 3
    } else {
      const offset = sinceTimeStart * step
      const value = from + offset
      count.value = value.toFixed(precision)
      lastTimeStamp = time
      requestAnimationFrame(core)
    }
  }

  function start() {
    if (state.value === 1 || state.value === 3) {
      return
    }
    state.value = 1
    lastTimeStamp = null
    requestAnimationFrame(core)
  }

  function pause() {
    if (state.value === 1) {
      state.value = 2
      lastTimeStamp = null
    }
  }

  function reset(autoPlay = false) {
    state.value = 0
    count.value = from.toFixed(precision)
    sinceTimeStart = 0
    lastTimeStamp = null
    autoPlay && start()
  }

  return {
    count,
    state,
    start,
    pause,
    reset
  }
}
```

```ts [useCountDown]
interface CountDownOptions {
  startText?: string
  finishText?: string
}

/**
 * 倒计时动画
 */
export function useCountDown(count: number, options: CountDownOptions = {}) {
  const {
    count: currentCount,
    state,
    start,
    pause,
    reset
  } = useCount({
    from: count,
    to: 0,
    duration: count * 1000,
    precision: 0
  })

  const { startText, finishText } = options

  const resetCount = computed(() => {
    const stateVal = state.value
    const countVal = currentCount.value
    if (stateVal === 0) {
      return startText || countVal
    }
    if (stateVal === 3) {
      return finishText || countVal
    }
    return countVal + 's'
  })

  return {
    resetCount,
    state,
    start,
    pause,
    reset: () => reset(true)
  }
}
```

```ts [useCountTo]
/**
 * 从 0 开始到指定数值的滚动动画
 */
export function useCountTo(to: number, duration: number, precision?: number) {
  return useCount({ from: 0, to, duration, precision })
}
```

:::
