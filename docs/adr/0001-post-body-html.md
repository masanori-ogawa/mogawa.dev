# PostBody は HTML で永続化し二重サニタイズする

管理画面に TipTap を導入するにあたり、PostBody の保存形式を Markdown / TipTap JSON ではなく HTML とした。TipTap の出力をそのまま扱えること、公開サイトの描画変換を最小にすることを優先した。XSS 対策として、API 保存時と site 表示時の両方で同じ `sanitizePostBody`（`packages/html`）を通し、許可タグ以外を落とす。既存記事はゼロ前提のため移行スクリプトは用意しない。
