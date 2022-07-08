import type { MinistaLocation } from "minista"
import { ReactNode } from "react"
import { Head } from "minista"

type RootProps = {
  location: MinistaLocation
  children: ReactNode
}

/**
 * @see https://minista.qranoko.jp/docs/root
 * @param location - 現在のpageのpath
 * @param children - React children
 */
const Root = ({ location, children }: RootProps) => {
  console.log(location)
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon/favicon.png" />
      </Head>
      {children}
    </>
  )
}

export default Root
