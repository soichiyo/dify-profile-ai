# ロゴアイコンコンポーネント

## 概要
アプリケーションのロゴアイコンを表示するためのコンポーネントです。

## 使用方法

```tsx
import LogoIcon from '@/app/components/base/logo-icon'

// サイズ指定
<LogoIcon size="small" />   // 24x24px
<LogoIcon size="medium" />  // 32x32px (デフォルト)
<LogoIcon size="large" />   // 48x48px

// カスタムクラス
<LogoIcon className="text-primary-600" />
```

## ロゴアイコンファイルの配置

### 推奨配置場所
```
app/components/base/logo-icon/
├── index.tsx          # コンポーネント本体
├── README.md          # このファイル
├── icons/             # アイコンファイル用ディレクトリ
│   ├── logo-small.png    # 24x24px
│   ├── logo-medium.png   # 32x32px
│   └── logo-large.png    # 48x48px
└── style.module.css   # スタイルファイル（必要に応じて）
```

### アイコンファイルの仕様
- **形式**: PNG（透明背景推奨）
- **サイズ**: 
  - 小: 24x24px
  - 中: 32x32px
  - 大: 48x48px
- **背景**: 透明（推奨）
- **ファイル名**: `logo-{size}.png`

## カスタマイズ方法

### 1. ロゴアイコンファイルを配置
`app/components/base/logo-icon/icons/` ディレクトリにロゴファイルを配置

### 2. コンポーネントを更新
`index.tsx` の絵文字部分を画像に置き換え

```tsx
// 例：画像を使用する場合
<img 
  src="/icons/logo-medium.png" 
  alt="Logo" 
  className="w-full h-full object-contain"
/>
```

### 3. 現在の実装
現在はデフォルトでロボット絵文字（🤖）を表示しています。
ロゴファイルを配置して、コンポーネントを更新することで、カスタムロゴに変更できます。

## 注意事項
- アイコンファイルは適切なサイズで作成してください
- 透明背景を使用することで、背景色に影響されません
- 高解像度ディスプレイ対応のため、2xサイズでの作成も検討してください
