import { isFunction } from "@src/util/isFunction"

/**
 * 関数なら実行する関数
 * @see https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src/function.ts#L9
 */
export function runIfFn<T, U>(
  valueOrFn: T | ((...fnArgs: U[]) => T),
  ...args: U[]
): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn
}
