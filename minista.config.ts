import { defineConfig } from "minista"
import { resolve } from "path"
import EnvironmentPlugin from "vite-plugin-environment"

const config = () => {
  console.log(process.env["NODE_ENV"])
  return defineConfig({
    resolve: {
      alias: [{ find: "@src/", replacement: resolve("src") + "/" }],
    },
    assets: {
      entry: ["src/scripts/main.ts"],
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
