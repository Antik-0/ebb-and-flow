interface Props {
  src: string
  alt?: string
}

export function ProseImg(props: Props) {
  return (
    <img
      alt={props.alt ?? 'ebb img'}
      class="motion-image"
      loading="lazy"
      src={props.src}
    />
  )
}
