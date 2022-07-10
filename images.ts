import minimist from "minimist"
import chokidar from "chokidar"
import path from "path"
import glob from "glob"
import fs from "fs"
import util from "util"

const src = "src/images/"
const dest = "public/images/"

const copyFilePromise = util.promisify(fs.copyFile)
const copyFiles: (
  srcDir: string,
  destDir: string,
  fileNames: string[]
) => Promise<Awaited<unknown>[]> = (srcDir, destDir, fileNames) => {
  return Promise.all(
    fileNames.map((fineName) => {
      return copyFilePromise(srcDir, path.join(destDir, fineName))
    })
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

  try {
    await copyFiles(currentPath, destPath, [fileName, `${fileName}.webp`])
  } catch (e) {
    console.log(e)
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
      })
  } else {
    /**
     * globでファイルを取得するしsrcのpathを連結する
     * chokidarのpathと同じ形に整形した配列
     * ['src/iamges/hoge.png', 'src/images/fuga.png']
     */
    const paths = glob
      .sync(`**/*.+(png|jpg)`, {
        cwd: path.resolve(process.cwd(), src),
      })
      .map((n) => path.join(src, n))

    paths.forEach((path) => {
      console.log("Building...", path)
      write(path)
    })
  }
}

main()
