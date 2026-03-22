'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CodeMotion } from '../components/CodeMotion'
import { CubeAvatar, MoonAvatar } from '../components/Effect'
import { FloatingText } from '../components/FloatingText'
import { setHtmlLayout } from '../controller/layout'
import { Power } from '../icons'
import { useTheme } from '../theme'

export function EbbLayoutHome() {
  const { theme } = useTheme()

  useEffect(() => setHtmlLayout('home'), [])

  return (
    <div className="home-page flex-col h-screen w-screen isolate">
      <div className="px-10 pb-20 pt-40 flex-col flex-1 items-center">
        <MoonAvatar avatar={theme.avatar} />

        <EbbAuthor author={theme.author} />

        <EbbTagline codes={theme.codes} tagline={theme.tagline} />

        <div className="h-20 w-full"></div>

        <EbbCarousel
          activeLink={theme.defaultActiveLink}
          avatar={theme.avatar}
        />
      </div>

      <div className="flex items-end inset-0 fixed -z-1">
        <div className="tidewater"></div>
      </div>
    </div>
  )
}

interface AuthorProps {
  author: string
}

function EbbAuthor(props: AuthorProps) {
  const [motion, setMotion] = useState('fade')

  return (
    <h1 className="mt-4 py-8 text-center w-full">
      <span
        className="site-title"
        data-motion={motion}
        onAnimationEnd={() => setMotion('flow')}
      >
        {props.author}
      </span>
    </h1>
  )
}

interface TaglineProps {
  tagline: string
  codes: string[]
}

function EbbTagline(props: TaglineProps) {
  const [motion, setMotion] = useState<'fade' | ''>('')

  return (
    <h2 className="text-6 py-4">
      <p className="tagline flex gap-2 items-center" data-motion={motion}>
        <FloatingText
          onMotionEnd={() => setMotion('fade')}
          text={props.tagline}
        />
        <CodeMotion codes={props.codes} cycle paused={motion !== 'fade'} />
      </p>
    </h2>
  )
}

type CarouselProps = {
  avatar: string
  activeLink: string
}

function EbbCarousel(props: CarouselProps) {
  const router = useRouter()

  return (
    <div
      className="cube-motion flex flex-center relative isolate"
      onClick={() => router.push(props.activeLink)}
    >
      <CubeAvatar avatar={props.avatar} />

      <div className="entry-button">
        <button
          aria-label="entry"
          className="text-teal p-3 rounded-full bg-black/10 flex cursor-pointer flex-center"
          type="button"
        >
          <Power className="text-10" />
        </button>
        <div aria-hidden="true" className="entry-background"></div>
      </div>
    </div>
  )
}
