/**
 * 関数か判定する関数
 * @see https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/assertion.ts#L28
 */
export function isFunction<T extends Function = Function>(
  value: any
): value is T {
  return typeof value === "function"
}
