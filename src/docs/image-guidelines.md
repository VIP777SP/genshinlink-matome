# 画像ファイルの命名規則とパス構造

このドキュメントでは、原神リンク集プロジェクトで使用されている画像ファイルの命名規則とパス構造について説明します。

## 基本パス構造

すべての画像ファイルは `public/` ディレクトリに配置され、以下のディレクトリ構造に従って整理されています：

```
public/
├── images/
│   ├── characters/    # キャラクター関連の画像
│   ├── weapons/       # 武器関連の画像
│   ├── artifacts/     # 聖遺物関連の画像
│   └── ...
├── textures/          # テクスチャやパターン画像
├── sounds/            # 効果音ファイル
└── ...
```

## 命名規則

### キャラクター画像

キャラクター画像は2種類のサイズで保存されています：

- **アイコン画像（小）**: `/images/characters/{character-id}-icon.png`
  - 使用例: `/images/characters/raiden-shogun-icon.png`
  - 使用場所: ティア表、パーティー編成、キャラリスト等の小さい表示用

- **全身画像（大）**: `/images/characters/{character-id}.png`
  - 使用例: `/images/characters/raiden-shogun.png`
  - 使用場所: キャラクター詳細ページ、ガイドページ等の大きい表示用

### 武器画像

- **武器画像**: `/images/weapons/{weapon-id}.png`
  - 使用例: `/images/weapons/engulfing-lightning.png`
  - 使用場所: 武器リスト、キャラ装備推奨等

### 聖遺物画像

- **聖遺物セット代表画像**: `/images/artifacts/{artifact-set-id}.png`
  - 使用例: `/images/artifacts/emblem-of-severed-fate.png`
  - 使用場所: 聖遺物リスト、セット効果紹介等

- **個別聖遺物画像**: `/images/artifacts/{artifact-set-id}-{piece}.png`
  - 使用例: `/images/artifacts/emblem-of-severed-fate-flower.png`
  - 部位: flower（花）, plume（羽）, sands（砂）, goblet（杯）, circlet（冠）

## ID命名規則

- キャラクターID: 基本的に英語名をケバブケース（ハイフン区切り）で表記
  - 例: `raiden-shogun`, `kazuha`, `hutao` など
- 武器ID: 武器の英語名をケバブケース（ハイフン区切り）で表記
  - 例: `engulfing-lightning`, `the-catch` など
- 聖遺物セットID: セットの英語名をケバブケース（ハイフン区切り）で表記
  - 例: `emblem-of-severed-fate`, `crimson-witch-of-flames` など

## 画像追加方法

新しいキャラクターや武器、聖遺物を追加する際は：

1. 適切なディレクトリに命名規則に従った画像ファイルを配置
2. `src/utils/characters.ts`（キャラクターの場合）または対応するデータファイルに情報を追加
3. iconUrlとfullImageUrlを正しく設定（キャラクターの場合）

## 注意点

- 画像はできるだけ透過PNGを使用
- ファイルサイズを最適化（圧縮）して使用
- 命名規則は必ず統一して、既存のパターンに従う 