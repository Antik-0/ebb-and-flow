# 防抖/节流

## source

::code-group

```ts [debounce]
type Fn = Function

interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

export function debounce(
  func: Fn,
  wait: number = 400,
  options: DebounceOptions = {}
) {
  let timerId: number | undefined,
    lastArgs: any,
    lastThis: any,
    lastCallTime: number | undefined,
    lastInvokeTime: number | undefined

  const leading = options.leading ?? false
  const trailing = options.trailing ?? true

  const maxWait = options.maxWait ?? 0
  const maxing = maxWait && maxWait !== 0

  function invokeFunc(time: number) {
    const thisArg = lastThis
    const argArray = lastArgs
    lastThis = lastArgs = undefined
    lastInvokeTime = time
    return func.apply(thisArg, argArray)
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - lastCallTime!
    const timeSinceLastInvoke = time - lastInvokeTime!

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      (maxing && timeSinceLastInvoke > maxWait)
    )
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time
    timerId = setTimeout(timerExpired, wait)
    return leading ? invokeFunc(time) : undefined
  }

  function trailingEdge(time: number) {
    timerId = undefined
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastThis = lastArgs = undefined
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }

    const timeSinceLastCall = time - lastCallTime!
    const timeSinceLastInvoke = time - lastInvokeTime!
    const timeWaiting = wait - timeSinceLastCall

    const remainingWait = maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting

    timerId = setTimeout(timerExpired, remainingWait)
  }

  function debounced(...args: any[]) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)
    lastCallTime = time

    lastArgs = args
    // @ts-ignore
    lastThis = this

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(time)
      }
      if (maxing) {
        clearTimeout(timerId)
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(time)
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
  }

  return debounced
}
```

```ts [throttle]
type ThrottleOptions = Omit<DebounceOptions, 'maxWait'>

export function throttle(
  func: Function,
  wait: number = 400,
  options: ThrottleOptions = {}
) {
  const leading = options.leading ?? true
  const trailing = options.trailing ?? true
  return debounce(func, wait, { maxWait: wait, leading, trailing })
}
```

::
