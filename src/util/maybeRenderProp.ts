import { ReactNode } from "react"

/**
 * reactのchildrenがFunction as Childとchildren両方を受け取れる型
 * @see https://github.com/chakra-ui/chakra-ui/blob/main/packages/react-utils/src/types.ts#L4
 */
export type MaybeRenderProp<P> = ReactNode | ((props: P) => ReactNode)
