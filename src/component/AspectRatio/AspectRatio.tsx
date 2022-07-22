import { ComponentProps } from "react"
import styles from "@src/component/AspectRatio/AspectRatio.module.css"
import cx from "classnames"

type Props = ComponentProps<"span"> & {
  ratio: number
}

export const AspectRatio = ({
  children,
  ratio,
  className,
  ...props
}: Props) => {
  return (
    <span
      className={cx(styles.root, className)}
      style={{
        aspectRatio: ratio.toString(),
      }}
      {...props}
    >
      {children}
    </span>
  )
}
