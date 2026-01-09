import { withVars } from '#/utils'
import './index.css'

export function FlowingLight() {
  return (
    <div aria-hidden="true" className="flowing-light">
      <div
        className="flowing-light__line"
        style={withVars({ '--angle-to': '180deg' })}
      ></div>
      <div
        className="flowing-light__line"
        style={withVars({ '--angle-to': '-180deg' })}
      ></div>
    </div>
  )
}
