'use client'
import type { PropsWithChildren } from 'react'
import type { WithHTMLProps } from '../types'
import { clsx } from '@repo/utils'
import { useState } from 'react'
import { Copy, CopyCheck } from '../icons'

interface Props extends WithHTMLProps<HTMLPreElement> {
  code?: string
  lines?: number
  language: string
  filename?: string
}

export function ProsePre(props: PropsWithChildren<Props>) {
  const { className, code, lines, language, filename, children, ...attrs } =
    props

  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (copied || !code) return

    await window.navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <pre
      className={clsx('group rounded-2 relative', className)}
      data-filename={filename}
      data-language={language}
      data-lines={lines}
      {...attrs}
    >
      <button
        aria-label="copy"
        className={clsx(
          'rounded-md flex size-8 cursor-pointer transition-all flex-center right-2 top-2 absolute',
          'text-muted-foreground bg-muted/40 opacity-0',
          'hover:text-accent-foreground hover:bg-muted group-hover:opacity-100',
          'data-[active=true]:opacity-100'
        )}
        data-active={copied}
        onClick={handleCopy}
        type="button"
      >
        {copied ? <CopyCheck /> : <Copy />}
      </button>
      {children}
    </pre>
  )
}
