import { defineConfig } from "minista"
import { resolve } from "path"

export default defineConfig({
  resolve: {
    alias: [{ find: "@src/", replacement: resolve("src") + "/" }],
  },
})
