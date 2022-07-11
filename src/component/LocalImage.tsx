import { imagesPath, ImagesPath } from "@src/lib/$images"

type LocalImageProps = Required<{
  readonly src: ImagesPath[number]["original"]
}>

export const LocalImage = ({ src }: LocalImageProps) => {
  const image = imagesPath.find(({ original }) => original === src)
  if (!image) {
    return <div>Image not found</div>
  }

  const srcset = image.paths
    .map(({ original, size }) => `${original} ${size}w`)
    .join(",")
  const webpSrcset = image.paths
    .map(({ webp, size }) => `${webp} ${size}w`)
    .join(",")

  return (
    <picture>
      <source srcSet={webpSrcset} type="image/webp" />
      <img
        src={image.paths.at(-1).original}
        alt=""
        decoding={"async"}
        loading={"lazy"}
        sizes="100vw"
        // width={image.width}
        // height={image.height}
        srcSet={srcset}
      />
    </picture>
  )
}
