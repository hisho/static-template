import minimist from "minimist"
import chokidar from "chokidar"
import path from "path"
import glob from "glob"
import fs from "fs"
import sharp from "sharp"
import sizeOf from "image-size"

const src = "src/images/"
const dest = "public/images/"
const options = {
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

const getImagePath = () => {
  return glob.sync(`**/*.+(png|jpg)`, {
    cwd: path.resolve(process.cwd(), src),
  })
}

const createImageMetaData = () => {
  const imageMapping = getImagePath().map((n) => {
    const imagePath = path.join(src, n)
    const { width, height } = sizeOf(imagePath)
    return {
      width,
      height,
      paths: {
        root: path.join("/images/", n),
        webp: path.join("/images/", `${n}.webp`),
      },
    }
  })

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
  const fileName = path.basename(currentPath)

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

  try {
    await Promise.all([
      sharpStream[isPngImage ? "png" : "jpeg"]({
        quality: options.imageMin[isPngImage ? "png" : "jpeg"].quality,
      }).toFile(path.join(destPath, fileName)),
      sharpStream
        .webp({ quality: options.imageMin.webp.quality })
        .toFile(path.join(destPath, `${fileName}.webp`)),
    ])
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
