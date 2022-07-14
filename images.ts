import minimist from "minimist"
import chokidar from "chokidar"
import path from "path"
import glob from "glob"
import fs from "fs"
import sharp from "sharp"
import sizeOf from "image-size"
import dayjs from "dayjs"

const src = "src/images/"
const dest = "public/images/"

const options = {
  deviceSizes: [640, 828, 1080, 1200, 1920],
  imageMin: {
    png: {
      quality: 90,
    },
    jpeg: {
      quality: 90,
    },
    webp: {
      quality: 90,
    },
  },
}

/**
 * 画像一覧を取得する
 * [hoge.png, hoge/fuga.png]
 */
const getImagePath = () => {
  return glob.sync(`**/*.+(png|jpg)`, {
    cwd: path.resolve(process.cwd(), src),
  })
}

/**
 * フロント側でほしいpathを作成する
 * hoge.png -> /images/hoge.png
 * huga/hoge.png -> /images/huga/hoge.png
 */
const pathJoinImagesDir = (...paths: string[]) => {
  return path.join("/images/", ...paths)
}

const createImageFileName = (
  {
    name,
    deviceSize,
    ext,
    isWebp = false,
  }: {
    name: string
    deviceSize: number
    ext: string
    isWebp?: boolean
  },
  ...params: string[]
) => {
  const param = params.length > 0 ? `?${params.join("")}` : ""
  return `${name}-w${deviceSize}${ext}${isWebp ? ".webp" : ""}${param}`
}

/**
 * すべての画像を取得してoptions.deviceSizesのsizeにリネームしたJSONを作成する
 *
 * @type {
 *   width: number, // 画像の幅
 *   height: number, // 画像の高さ
 *   original: string, // フロントで使う画像のpath(/images/hoge.png)
 *   paths: {
 *    deviceSize: number, // フロントで使うデバイスサイズ(options.deviceSizes一つ一つ)
 *    original: string, // フロントで使う元の画像をdeviceSizeにリネームしたものpath(/images/hoge-w{deviceSizes一つ一つ}.png)
 *    webp: string, // フロントで使う元の画像をwebpにしdeviceSizeにリネームしたものpath(/images/hoge-w{deviceSizes一つ一つ}.png.webp)
 *   }[]
 * }[]
 */
const createImageMapping = () => {
  return getImagePath().map((currentPath) => {
    const { dir, name, ext } = path.parse(currentPath)
    const imagePath = path.join(src, currentPath)
    const stat = fs.statSync(imagePath)
    const updateTime = dayjs(stat.mtime).format("YYYYMMDDHHmmss")
    console.log(updateTime)
    const { width, height } = sizeOf(imagePath)
    return {
      width,
      height,
      original: pathJoinImagesDir(currentPath),
      paths: options.deviceSizes.map((deviceSize) => {
        return {
          size: deviceSize,
          original: pathJoinImagesDir(
            dir,
            createImageFileName({ name, deviceSize, ext }, updateTime)
          ),
          webp: pathJoinImagesDir(
            dir,
            createImageFileName(
              { name, deviceSize, ext, isWebp: true },
              updateTime
            )
          ),
        }
      }),
    }
  })
}

const createImageMetaData = () => {
  const imageMapping = createImageMapping()

  fs.writeFile(
    `src/lib/$images.ts`,
    `/* eslint-disable */
// prettier-ignore
export const imagesPath = ${JSON.stringify(imageMapping, null, "\t")} as const;
export type ImagesPath = typeof imagesPath`,
    () => {}
  )
}

const write = async (currentPath: string) => {
  const { base: fileName, ext, name } = path.parse(currentPath)

  /**
   * srcのpathを割り出してdistのpathを連結する
   * 'src/images/hoge.png' -> 'public/images/hoge.png'
   * 'src/images/hoge/fuga.png' -> 'public/images/hoge/fuga.png'
   */
  const destPath = path
    .join(dest, path.dirname(currentPath), "/")
    .replace(new RegExp(src), "")

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true })
  }

  const sharpStream = sharp(currentPath)
  const isPngImage = path.extname(fileName) === ".png"
  const createDeviceSizes = () =>
    options.deviceSizes.map((deviceSize) =>
      sharpStream
        .resize(deviceSize)
        [isPngImage ? "png" : "jpeg"]({
          quality: options.imageMin[isPngImage ? "png" : "jpeg"].quality,
        })
        .toFile(
          path.join(destPath, createImageFileName({ name, deviceSize, ext }))
        )
    )

  const createWebpDeviceSizes = () =>
    options.deviceSizes.map((deviceSize) =>
      sharpStream
        .resize(deviceSize)
        .webp({
          quality: options.imageMin.webp.quality,
        })
        .toFile(
          path.join(
            destPath,
            createImageFileName({ name, deviceSize, ext, isWebp: true })
          )
        )
    )

  try {
    await Promise.all([...createDeviceSizes(), ...createWebpDeviceSizes()])
  } catch (e) {
    console.log(`error! ${currentPath}`)
  }
}

const main = async () => {
  // @ts-ignore
  const args = process.argv.slice(2)
  const argv = minimist<{ watch?: ""; w?: "" }>(args, {
    string: ["watch"],
    alias: { w: "watch" },
  })

  if (argv.watch !== undefined) {
    chokidar
      .watch(
        ["**/*.png", "**/*.jpg"].map((n) => path.join(src, n)),
        {
          ignoreInitial: true,
        }
      )
      .on("all", (eventName, path) => {
        console.log("Watching...", eventName, path)
        write(path)
        createImageMetaData()
      })
  } else {
    getImagePath().forEach((imagePath) => {
      const imagePathWithSrc = path.join(src, imagePath)
      console.log("Building...", imagePathWithSrc)
      write(imagePathWithSrc)
    })
    createImageMetaData()
  }
}

main()
