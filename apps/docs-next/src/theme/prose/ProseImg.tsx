import type { WithHTMLProps } from '../types'

interface Props extends WithHTMLProps {
  src: string
  alt?: string
}

export function ProseImg(props: Props) {
  const { src, alt, ...restProps } = props
  return (
    <img
      alt={alt ?? 'ebb img'}
      className="motion-image"
      loading="lazy"
      src={src}
      {...restProps}
    />
  )
}
