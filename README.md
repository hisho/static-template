# static-template

静的サイトテンプレート

## 機能

- minista を用いた React の SSG

## セットアップ

```shell
$ npm ci
```

```shell
$ npm run start
```

## コマンド

### スタート

```shell
$ npm run start
```

### ビルド

```shell
$ npm run build
```

### ビルドし実際の表示をプレビュー

```shell
$ npm run preview
```

### 整形

```shell
$ npm run format
```

## 各 Component

### LocalImage

`src/images/**/*.{png,jpg,}`を補完ありで表示する Component

<details>
  <summary>
    LocalImageの詳細
  </summary>
  <div>

## 機能

- 画像を自動で補完して表示する
- 画像の名前から自動でアートディレクション対応する
- 画像の with と height から自動でアスペクト比を取る
- `objectFit`と`objectPosition`がショートハンドで使用可能
- `src`,`srcSet`と`sizes`を除く全ての画像の attribute を設定可能

## 通常の表示

```tsx
import { LocalImage } from "@src/component/LocalImage"

export const Index = () => {
  return (
    <>
      <LocalImage src={"/images/path/to/your/image.png"} />
    </>
  )
}
```

## アートディレクション対応の表示

※ pc 名と同名でサフィックスに`_sp`を付与した場合自動でアートディレクション対応する

```tsx
import { LocalImage } from "@src/component/LocalImage"

export const Index = () => {
  return (
    <>
      <LocalImage src={"/images/path/to/your/image.png"} />
    </>
  )
}
```

## アスペクト比オフ

`layout={'fill'}`を指定する

```tsx
import { LocalImage } from "@src/component/LocalImage"

export const Index = () => {
  return (
    <>
      <LocalImage layout={"fill"} src={"/images/path/to/your/image.png"} />
    </>
  )
}
```

## objectFit と objectPosition のショートハンドが使用可能

`objectPosition={'値'}`を指定する  
`objectFit={'値'}`を指定する

```tsx
import { LocalImage } from "@src/component/LocalImage"

export const Index = () => {
  return (
    <>
      <LocalImage
        objectPosition={"center"}
        objectFit={"contain"}
        src={"/images/path/to/your/image.png"}
      />
    </>
  )
}
```

  </div>
</details>

## 参考

- https://minista.qranoko.jp
- https://ja.reactjs.org
