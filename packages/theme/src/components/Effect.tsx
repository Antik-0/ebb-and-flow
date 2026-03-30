import type { ClassValue, FunctionalComponent, StyleValue } from 'vue'

interface AvatarProps {
  avatar: string
}

export const Avatar: FunctionalComponent<AvatarProps, { click: () => void }> = (
  { avatar },
  { emit, attrs }
) => {
  return (
    <button
      aria-label="avatar"
      class="cursor-pointer drop-shadow-sm drop-shadow-color-cyan-300"
      onClick={() => emit('click')}
      type="button"
      {...attrs}
    >
      <div class="mask mask-squircle">
        <img
          alt="site owner avatar"
          class="size-[44px]"
          decoding="async"
          src={avatar}
        />
      </div>
    </button>
  )
}
Avatar.props = ['avatar']
Avatar.emits = ['click']

export const MoonAvatar: FunctionalComponent<AvatarProps> = (
  { avatar },
  { attrs }
) => {
  return (
    <div class="moon-avatar size-50 cursor-pointer relative isolate" {...attrs}>
      <div class="rounded-full inset-0 absolute z-20 overflow-hidden">
        <img
          alt="site owner avatar"
          class="transition-transform duration-600 ease-out"
          src={avatar}
        />
      </div>
      <div class="moon-bg"></div>
      <div class="moon-mask"></div>
    </div>
  )
}
MoonAvatar.props = ['avatar']

export const CubeAvatar: FunctionalComponent<AvatarProps> = (
  { avatar },
  { attrs }
) => {
  return (
    <div class="cube-avatar" {...attrs}>
      <div class="cube" style={{ '--avatar': `url(${avatar})` }}>
        <div class="cube-face" data-state="front"></div>
        <div class="cube-face" data-state="back"></div>
        <div class="cube-face" data-state="top"></div>
        <div class="cube-face" data-state="bottom"></div>
        <div class="cube-face" data-state="left"></div>
        <div class="cube-face" data-state="right"></div>
      </div>
    </div>
  )
}
CubeAvatar.props = ['avatar']

export const FlowingLight: FunctionalComponent = (_, { attrs }) => {
  return (
    <div aria-hidden="true" class="flowing-light" {...attrs}>
      <div class="light-line" style="--angle-to: 180deg"></div>
      <div class="light-line" style="--angle-to: -180deg"></div>
    </div>
  )
}

export const GlassMask: FunctionalComponent<{
  class?: ClassValue
  style?: StyleValue
}> = (_, { attrs }) => {
  return (
    <div aria-hidden="true" class="glass-mask" {...attrs}>
      <div class="mask-image"></div>
    </div>
  )
}

const pathLength = Math.ceil(2 * Math.PI * 12)

export function ScrollIndicator() {
  return (
    <svg
      height="1em"
      style="rotate: -90deg"
      viewBox="0 0 32 32"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="scroll-indicator"
        cx="16"
        cy="16"
        fill="none"
        r="12"
        stroke="currentColor"
        stroke-dasharray={pathLength}
        stroke-linecap="round"
        stroke-width="3"
        style={{
          '--value-from': pathLength,
          '--value-to': 0
        }}
      />
    </svg>
  )
}
