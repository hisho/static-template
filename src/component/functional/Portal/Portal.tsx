import { ReactNode } from "react"
import { createPortal } from "react-dom"

type PortalProps = {
  children: ReactNode
  element?: HTMLElement
}

/**
 * childrenを好きな場所にrenderするコンポーネント
 * elementを指定しない場合はbody直下にrenderされる
 */
export const Portal = ({ children, element }: PortalProps) => {
  const _element = element ? element : document.body
  return <>{createPortal(children, _element)}</>
}
