'use client'
import { useEffect, useRef, useState } from 'react'

export function CardCover({ src }: { src: string }) {
  const [isLoading, setLoading] = useState(true)
  const cover = useRef<HTMLImageElement>(null!)

  function onLoad() {
    setLoading(false)
  }

  useEffect(() => {
    if (cover.current?.complete) {
      setLoading(false)
    }
  }, [])

  return (
    <picture className="relative overflow-hidden">
      {isLoading && (
        <div className="p-8 bg-black inset-0 absolute z-10">
          <img
            alt="loading"
            className="size-full object-contain"
            src="/loading.webp"
          />
        </div>
      )}
      <img
        alt="cover"
        className="card-cover"
        loading="lazy"
        onLoad={onLoad}
        ref={cover}
        src={src}
      />
    </picture>
  )
}
