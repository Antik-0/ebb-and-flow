import { useAnimation } from '../hooks'
import { Rocket } from '../icons'

export function BackToTop() {
  const [animation, scope] = useAnimation<HTMLButtonElement>(
    [{ transform: 'translateY(10px)' }, { transform: 'translateY(-100px)' }],
    {
      duration: 1000,
      easing: 'cubic-bezier(0.6, -0.28, 0.74, 0.05)'
    }
  )

  function backToTop() {
    animation.play()
    document.documentElement.scrollIntoView()
  }

  return (
    <button
      aria-label="back to top"
      className="text-6 text-muted-foreground flex size-10 cursor-pointer flex-center hover:text-brand-3"
      onClick={backToTop}
      ref={scope}
      title="回到顶部"
      type="button"
    >
      <Rocket />
    </button>
  )
}
