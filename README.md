# Prairie AI Beta

Prairie AI Betaは、AIエージェントとの会話を可能にするNext.jsベースのWebアプリケーションです。

## プロジェクト概要

- **フレームワーク**: Next.js 14.2.32
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **国際化**: i18next対応（日本語対応）
- **デプロイ**: Vercel、Docker対応

## 主要機能

- AIエージェントとのリアルタイムチャット
- 多言語対応（日本語）
- フィードバック評価システム
- ファイルアップロード機能
- レスポンシブデザイン

## 変更履歴

プロジェクトの詳細な変更履歴については、[CHANGELOG.md](./CHANGELOG.md)をご覧ください。

## 設定

### 環境変数

`.env.local`ファイルを作成し、以下の内容を設定してください：

```bash
# APP ID: アプリの一意識別子
NEXT_PUBLIC_APP_ID=

# APP API Key: APIリクエストの認証キー
NEXT_PUBLIC_APP_KEY=

# APP URL: APIのベースURL
NEXT_PUBLIC_API_URL=
```

### アプリケーション設定

`config/index.ts`ファイルでアプリケーションの基本設定を行います：

```js
export const APP_INFO: AppInfo = {
  title: 'Prairie AI Beta',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'ja'
}

export const isShowPrompt = true
export const promptTemplate = ''
```

## セットアップ

### 依存関係のインストール

```bash
npm install
# または
yarn
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## Docker での使用

```bash
# イメージのビルド
docker build . -t <DOCKER_HUB_REPO>/webapp-conversation:latest

# コンテナの起動（ポート3000でアクセス可能）
docker run -p 3000:3000 <DOCKER_HUB_REPO>/webapp-conversation:latest
```

## ビルドとデプロイ

### 本番ビルド

```bash
npm run build
```

### 本番サーバーの起動

```bash
npm start
```

### Vercel でのデプロイ

最も簡単なデプロイ方法は [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。

> ⚠️ [Vercel Hobby](https://vercel.com/pricing) プランを使用している場合、メッセージが制限により切り詰められる可能性があります。

詳細については [Next.js デプロイメントドキュメント](https://nextjs.org/docs/deployment) をご覧ください。

## 技術スタック

- **フロントエンド**: Next.js, React, TypeScript
- **スタイリング**: Tailwind CSS
- **国際化**: i18next
- **ビルドツール**: Webpack, SWC
- **開発環境**: ESLint, Prettier

## 学習リソース

Next.jsについて詳しく学ぶには、以下のリソースをご覧ください：

- [Next.js Documentation](https://nextjs.org/docs) - Next.jsの機能とAPIについて
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアル
- [Next.js GitHub repository](https://github.com/vercel/next.js/) - フィードバックとコントリビューションを歓迎します

## ライセンス

このプロジェクトは適切なライセンスの下で公開されています。詳細については、プロジェクトのルートディレクトリにあるライセンスファイルをご確認ください。

## サポート

問題や質問がある場合は、プロジェクトのIssuesページで報告してください。
