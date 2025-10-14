interface DebounceOptions {
  maxWait?: number
  immediate?: boolean
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout: number = 400,
  options: DebounceOptions = {}
) {
  const maxWait = options?.maxWait
  const immediate = options?.immediate ?? false

  let timerId: number | undefined
  let lastArgs: any[] = []
  let lastInvokeTime!: number
  let lastTriggerTime!: number

  function timerExpired() {
    const time = Date.now()

    const timeSinceLastTrigger = time - lastTriggerTime
    if (timeSinceLastTrigger >= timeout) {
      invokeFunc(time)
      timerId = undefined
      return
    }

    if (maxWait && time - lastInvokeTime >= maxWait) {
      invokeFunc(time)
    }
    const remainingWait = Math.max(0, timeout - timeSinceLastTrigger)
    timerId = setTimeout(timerExpired, remainingWait)
  }

  function invokeFunc(time: number) {
    func(...lastArgs)
    lastInvokeTime = time
  }

  const debounced = (...args: any[]) => {
    const time = Date.now()
    lastArgs = args

    if (!timerId) {
      lastInvokeTime = time
      lastTriggerTime = time
      immediate && invokeFunc(time)
      timerId = setTimeout(timerExpired, timeout)
    }

    if (maxWait && time - lastInvokeTime > maxWait) {
      invokeFunc(time)
    }

    lastTriggerTime = time
  }

  return debounced
}

type ThrottleOptions = Omit<DebounceOptions, 'maxWait'>

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  timeout: number = 400,
  options: ThrottleOptions = {}
) {
  return debounce(func, timeout, { ...options, maxWait: timeout })
}
