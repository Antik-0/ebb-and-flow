import type { HTMLAttributes } from 'react'

export type Fn = (...args: any[]) => any

export type Timer = NodeJS.Timeout | number

export interface PageData extends PageMetadata {}

export type WithHTMLProps<T = HTMLDivElement> = HTMLAttributes<T>

export * from './menu.ts'
export * from './theme.ts'
