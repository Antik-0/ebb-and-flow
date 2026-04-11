'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { withViewTransition } from '#/utils'
import { CodeMotion } from '../components/CodeMotion'
import { CubeAvatar, MoonAvatar } from '../components/Effect'
import { FloatingText } from '../components/FloatingText'
import { setHtmlLayout } from '../controller/layout'
import { Power } from '../icons'
import { useTheme } from '../theme'

export function EbbHome() {
  const { theme } = useTheme()

  useEffect(() => setHtmlLayout('home'), [])

  return (
    <div className="home-page isolate h-screen w-screen flex-col">
      <div className="flex-1 flex-col items-center px-10 pt-40 pb-20">
        <MoonAvatar avatar={theme.avatar} />

        <EbbAuthor author={theme.author} />

        <EbbTagline codes={theme.codes} tagline={theme.tagline} />

        <div className="h-20 w-full"></div>

        <EbbCarousel
          activeLink={theme.defaultActiveLink}
          avatar={theme.avatar}
        />
      </div>

      <div className="fixed inset-0 -z-1 flex items-end">
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
    <h1 className="mt-4 w-full py-8 text-center">
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
    <h2 className="py-4 text-6">
      <p className="tagline flex items-center gap-2" data-motion={motion}>
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

  function handleClick() {
    withViewTransition('/', '')
    router.push(props.activeLink)
  }

  return (
    <div
      className="cube-motion relative isolate flex flex-center"
      onClick={handleClick}
    >
      <CubeAvatar avatar={props.avatar} />

      <div className="entry-button">
        <button
          aria-label="entry"
          className="flex flex-center cursor-pointer rounded-full bg-black/10 p-3 text-teal"
          type="button"
        >
          <Power className="text-10" />
        </button>
        <div aria-hidden="true" className="entry-background"></div>
      </div>
    </div>
  )
}
