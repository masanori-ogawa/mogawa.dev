# mogawa.dev

Webエンジニア向けポートフォリオ + ブログのモノレポです。

## 構成

```text
apps/
  site/      TanStack Start (SSG) — 公開サイト
  console/   TanStack Start (CSR/SPA) — 記事管理画面
  api/       Hono on Cloudflare Workers — API
packages/
  schemas/   Valibot 共有スキーマ
  db/        Drizzle + Turso
  api-client Hono RPC client (`hc`)
```

## 技術スタック

- Frontend: TanStack Start / React / TypeScript / Tailwind CSS 4
- API: Hono + Clerk + Valibot
- DB: Turso (libSQL) + Drizzle ORM
- Deploy: Cloudflare Workers（site / console / api を分離）

## セットアップ

### 1. 依存関係

```bash
bun install
cp .env.example .env
cp apps/api/.dev.vars.example apps/api/.dev.vars
cp apps/console/.env.example apps/console/.env.local
```

### 2. Turso

1. Turso DB を作成
2. `.env` / `apps/api/.dev.vars` に `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` を設定
3. マイグレーション実行

```bash
bun run db:migrate
```

### 3. Clerk

1. Clerk アプリケーションを作成
2. Publishable Key を `apps/console/.env.local` の `VITE_CLERK_PUBLISHABLE_KEY` へ
3. Secret Key / Publishable Key を `apps/api/.dev.vars` へ
4. 自分の User ID を `ADMIN_CLERK_USER_ID` に設定
5. Console の origin（例: `http://localhost:3001`）を Clerk の許可オリジンへ追加
6. 管理者アカウントで MFA / パスキーを有効化
7. 必要なら自己登録を制限

### 4. ローカル起動

3アプリをまとめて起動:

```bash
bun run dev
```

個別起動も可能です。

```bash
bun run dev:api
bun run dev:site
bun run dev:console
```

- Site: http://localhost:3000
- Console: http://localhost:3001
- API: http://localhost:8787

## 検証

```bash
bun run typecheck
bun run test
bun run --filter @mogawa/api build
bun run --filter @mogawa/site build
bun run --filter @mogawa/console build
```

## 公開フロー

1. Console で記事を作成・公開
2. API が Turso に保存
3. API が Cloudflare Workers Builds の Deploy Hook へ `POST`
4. Site が再ビルドされ、Route Loader + `hc` で公開記事を取得して静的生成

## Cloudflare デプロイ

各アプリの `CLOUDFLARE.md` を参照してください。

共通の注意:

- Public リポジトリに Secret をコミットしない（`.env` / `.dev.vars` は gitignore 済み）
- API Secrets は `wrangler secret put` または Workers ダッシュボードで設定
- Site / Console / API を別 Worker プロジェクトとして同じリポジトリへ接続
- GitHub の Secret scanning / Dependabot を有効化
- 漏洩した Secret はローテーションする（履歴削除だけでは不十分）

## 便利コマンド

```bash
bun run typecheck
bun run test
bun run build
bun run db:generate
bun run db:migrate
bun run db:studio
```

## Public リポジトリでの安全運用

公開してよいもの:

- ソースコード
- Drizzle schema / migration SQL
- `.env.example`（値なし）
- Clerk Publishable Key（クライアント公開前提）

公開してはいけないもの:

- `CLERK_SECRET_KEY`
- `TURSO_AUTH_TOKEN`
- `SITE_DEPLOY_HOOK_URL`
- DB ダンプ / 本番データ
