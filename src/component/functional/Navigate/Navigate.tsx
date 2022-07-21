import type { MaybeRenderProp } from "@src/util/maybeRenderProp"
import { isFunction } from "@src/util/isFunction"
import { runIfFn } from "@src/util/runIfFn"
import { PagesPath, pagesPath } from "@src/lib/pathpida/$path"
import type { UrlObject } from "url"
import { resolveHref } from "next/dist/shared/lib/router/router"
import Router from "next/router"

type NavigateProps = {
  children: MaybeRenderProp<{ isCurrent: boolean }>
  href: ((path: PagesPath) => UrlObject) | UrlObject
}

/**
 * ページ遷移するためのリンクを表示するコンポーネント
 * hrefから返ってくる値はpathpidaのpagesPath
 * @see https://nextjs.org/docs/api-reference/next/link
 * @see https://github.com/vercel/next.js/blob/canary/packages/next/client/link.tsx
 * @example
 * hrefの高階関数を使ってリンクを表示する場合
 * <Navigate href={(path) => path.home.$url()}>
 * <a>Home</a>
 * </Navigate>
 *
 * hrefの高階関数を使わずに直接pagesPathを渡す場合
 * <Navigate href={pagesPath.home.$url()}>
 * <a>Home</a>
 * </Navigate>
 *
 * Buttonをaタグにキャストする場合
 * <Navigate href={(path) => path.home.$url()}>
 * <button>Home</a>
 * </Navigate>
 *
 * Function as Childを使ってstateを使う場合
 * <Navigate href={(path) => path.home.$url()}>
 * {({ isCurrent }) => <a>{isCurrent ? '現在のページ' : 'その他'}</a>}
 * </Navigate>
 */
export const Navigate = ({ children, href }: NavigateProps) => {
  const currentPathname = isFunction(href)
    ? href(pagesPath).pathname
    : href.pathname
  //TODO pathNameを設定する
  // const isCurrent = pathname === currentPathname
  const state = { isCurrent: false }
  const _href = isFunction(href) ? href(pagesPath) : href
  return <a href={resolveHref(Router, _href)}>{runIfFn(children, state)}</a>
}
