import type { MaybeRefOrGetter } from './helper'
import { useEffect, useRef, useState } from 'react'
import { toValue } from './helper'

export function useMediaQuery(
  query: MaybeRefOrGetter<string>,
  options: { initialValue?: boolean } = {}
) {
  const mediaQuery = useRef<MediaQueryList>(null)
  const [matches, setMatches] = useState(options.initialValue ?? false)

  useEffect(() => {
    function handler(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    mediaQuery.current = window.matchMedia(toValue(query))
    mediaQuery.current.addEventListener('change', handler)
    setMatches(mediaQuery.current.matches)

    return () => {
      mediaQuery.current?.removeEventListener('change', handler)
    }
  }, [])

  return matches
}
