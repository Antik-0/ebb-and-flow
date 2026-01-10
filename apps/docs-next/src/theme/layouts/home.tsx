'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CodeMotion } from '../components/CodeMotion'
import { CubeAvatar } from '../components/CubeAvatar'
import { FloatingText } from '../components/FloatingText'
import { Power } from '../icons'
import { useTheme } from '../theme.ts'

export function EbbLayoutHome() {
  const { theme } = useTheme()

  return (
    <div className="flex-col h-screen w-screen isolate">
      <div className="px-10 pb-20 pt-40 flex-col flex-1 items-center">
        <EbbMoonAvatar avatar={theme.avatar} />

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
  const [animating, setAnimating] = useState(true)

  return (
    <h1 className="mt-4 py-8 text-center w-full">
      <span
        className="site-title"
        data-animating={animating}
        onAnimationEnd={() => setAnimating(false)}
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
      <p
        className="tagline flex gap-2 items-center"
        data-motion="taglineMotion"
      >
        <FloatingText
          onMotionEnd={() => setMotion('fade')}
          text={props.tagline}
        />
        <CodeMotion codes={props.codes} cycle paused={motion !== 'fade'} />
      </p>
    </h2>
  )
}

interface MoonAvatarProps {
  avatar: string
}

function EbbMoonAvatar(props: MoonAvatarProps) {
  return (
    <div className="moon-avatar size-50 cursor-pointer relative isolate">
      <div className="rounded-full inset-0 absolute z-20 overflow-hidden">
        <Image
          alt="site owner avatar"
          className="transition-transform duration-800 ease-in-out"
          height={200}
          loading="eager"
          src={props.avatar}
          width={200}
        />
      </div>
      <div className="moon-bg"></div>
      <div className="moon-mask"></div>
    </div>
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
