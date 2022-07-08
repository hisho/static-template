import minimist from "minimist"
import chokidar from "chokidar"
import path from "path"
import glob from "glob"

const write = async (path: string) => {
  //TODO:実際の処理を書く
  console.log("write", path)
}

const src = "src/images/"

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
        ["**/*.png", "**/*.jpg"].map((n) => `${src}${n}`),
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
      .map((n) => src + n)

    paths.forEach((path) => {
      console.log("Building...", path)
      write(path)
    })
  }
}

main()
