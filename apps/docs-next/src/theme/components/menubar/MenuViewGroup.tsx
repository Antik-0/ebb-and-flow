import type { MenuItem } from '../../types'
import { clsx } from '@repo/utils'
import { useState } from 'react'
import { EbbLink } from '../Link'

interface MenuViewGroupProps {
  items: MenuItem[]
}

export function MenuViewGroup(props: MenuViewGroupProps) {
  const [groups] = useState(() => buildGroups(props.items ?? []))

  return (
    <div className="p-6">
      {groups.map((group, index) => (
        <div className={index === 0 ? undefined : 'mt-4'} key={index}>
          {group.label && (
            <div className="mb-3 font-600 text-brand text-sm leading-8">
              {group.label}
            </div>
          )}
          <section className="grid gap-4">
            {group.children.map(item => (
              <EbbLink href={item.link} key={item.text}>
                <span
                  className={clsx(
                    'block rounded-2 p-3 text-foreground',
                    'ease transition-colors duration-250',
                    'hover:bg-brand-2/20 hover:text-brand-2'
                  )}
                >
                  <span className="text-nowrap text-sm">{item.text}</span>
                </span>
              </EbbLink>
            ))}
          </section>
        </div>
      ))}
    </div>
  )
}

interface Group {
  label?: string
  children: MenuItem[]
}

function buildGroups(items: MenuItem[]) {
  const groupMap: Group[] = []
  let group: MenuItem[] = []
  for (const item of items) {
    if (item.items) {
      group.length && groupMap.push({ children: group })
      groupMap.push({ label: item.text, children: item.items })
      group = []
    } else {
      group.push(item)
    }
  }
  group.length && groupMap.push({ children: group })
  return groupMap
}
