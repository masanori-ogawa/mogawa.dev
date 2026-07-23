# Portfolio

個人ポートフォリオとブログの公開を扱うコンテキスト。

## Language

**Post**:
リポジトリ内の MDX として管理し、公開状態に応じて訪問者へ見せるブログ記事。
_Avoid_: Article（会話では Post に統一）, entry

**PostBody**:
Post の本文。永続化形式は MDX（`posts/*.mdx`）。
_Avoid_: HTML body, TipTap JSON, ProseMirror doc

**Draft**:
未公開の Post。frontmatter の `draft: true` で表し、公開サイトには出ない。
_Avoid_: unpublished（状態名は draft）

**Published Post**:
公開済みの Post（`draft` でないもの）。静的サイト生成の対象になる。
_Avoid_: live post

**Profile**:
トップに載せる短い自己紹介とリンクなど、コード管理される静的な人物情報。
_Avoid_: About page（独立した About / Projects ページは持たない）

**Blog**:
トップ（`/`）の記事一覧と、`/blog/$slug` の詳細面。
_Avoid_: Posts（公開側の機能名は Blog）

## Example dialogue

Dev: 「Post を公開したら Blog に出る？」
Expert: 「Published Post だけが Blog の対象。Draft は出ない。」

Dev: 「本文は HTML？」
Expert: 「いや PostBody は MDX。`posts/` に置いてビルド時にコンパイルする。」

Dev: 「Profile も MDX？」
Expert: 「いまはコード管理の静的情報。Blog の Post とは別。」
