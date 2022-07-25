import { imagesPath, ImagesPath } from "@src/lib/$images"
import { ComponentProps, CSSProperties, Fragment, useMemo } from "react"
import cx from "classnames"

type LocalImageProps = Required<{
  readonly src: ImagesPath[number]["original"]
}> & {
  readonly layout?: "responsive" | "fill"
  readonly objectFit?: "contain" | "cover"
  readonly objectPosition?: CSSProperties["objectPosition"]
} & Omit<ComponentProps<"img">, "src" | "srcSet" | "sizes">

export const LocalImage = ({
  src,
  layout = "responsive",
  objectFit = "contain",
  objectPosition = "center",
  style,
  ...props
}: LocalImageProps) => {
  const image = imagesPath.find(({ original }) => original === src)
  if (!image) {
    return <div>Image not found</div>
  }

  const WrapperElement = useMemo(() => {
    return layout === "responsive"
      ? ({
          ratio,
          style,
          ...props
        }: ComponentProps<"span"> & { ratio: number }) => (
          <span
            style={{
              aspectRatio: ratio.toString(),
              display: "block",
              ...style,
            }}
            {...props}
          />
        )
      : Fragment
  }, [layout])

  const srcset = image.paths
    .map(({ original, size }) => `${original} ${size}w`)
    .join(",")
  const webpSrcset = image.paths
    .map(({ webp, size }) => `${webp} ${size}w`)
    .join(",")

  const mobileSrc = "/images/" + image.mobileImageName
  const mobileImage =
    imagesPath.find(({ original }) => original === mobileSrc) ?? null
  if (mobileImage === null) {
    return (
      <span
        style={{ display: "block", position: "relative", overflow: "hidden" }}
      >
        <WrapperElement
          ratio={image.width / image.height}
          className={"hidden md:block"}
        />
        <picture>
          <source srcSet={webpSrcset} type="image/webp" />
          <img
            src={image.paths.at(-1).original}
            alt=""
            decoding={"async"}
            loading={"lazy"}
            sizes="100vw"
            width={image.width}
            height={image.height}
            srcSet={srcset}
            {...props}
            style={{
              objectFit,
              objectPosition,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              ...style,
            }}
          />
        </picture>
      </span>
    )
  }

  const mobileSrcset = mobileImage.paths
    .map(({ original, size }) => `${original} ${size}w`)
    .join(",")
  const mobileWebpSrcset = mobileImage.paths
    .map(({ webp, size }) => `${webp} ${size}w`)
    .join(",")

  return (
    <span
      style={{ display: "block", position: "relative", overflow: "hidden" }}
    >
      <WrapperElement
        ratio={image.width / image.height}
        className={"hidden md:block"}
      />
      <WrapperElement
        ratio={mobileImage.width / mobileImage.height}
        className={"md:hidden"}
      />
      <picture>
        <source srcSet={srcset} type="image/webp" media="(min-width: 768px)" />
        <source srcSet={webpSrcset} media="(min-width: 768px)" />
        <source srcSet={mobileWebpSrcset} type="image/webp" />
        <img
          src={mobileImage.paths.at(-1).original}
          alt=""
          decoding={"async"}
          loading={"lazy"}
          sizes="100vw"
          width={image.width}
          height={image.height}
          srcSet={mobileSrcset}
          {...props}
          style={{
            objectFit,
            objectPosition,
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            ...style,
          }}
        />
      </picture>
    </span>
  )
}
