import { stylex } from '#/utils'

export function FlowingLight() {
  return (
    <div aria-hidden="true" className="flowing-light">
      <div
        className="flowing-light__line"
        style={stylex({ '--angle-to': '180deg' })}
      ></div>
      <div
        className="flowing-light__line"
        style={stylex({ '--angle-to': '-180deg' })}
      ></div>
    </div>
  )
}
