import { defineConfig } from "minista"
import { resolve } from "path"
import EnvironmentPlugin from "vite-plugin-environment"

const config = () => {
  return defineConfig({
    resolve: {
      alias: [{ find: "@src/", replacement: resolve("src") + "/" }],
    },
    assets: {
      entry: [
        "src/scripts/main.ts",
        "src/styles/common.scss",
        "src/styles/tailwind.css",
      ],
      bundle: {
        outName: "[name]",
      },
    },
    vite: {
      plugins: [
        EnvironmentPlugin({
          NODE_ENV: process.env["NODE_ENV"] ?? "development",
        }),
      ],
    },
  })
}

export default config()
