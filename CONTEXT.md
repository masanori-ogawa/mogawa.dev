# Portfolio

個人ポートフォリオとブログの公開・管理を扱うコンテキスト。

## Language

**Post**:
管理者が作成し、公開状態に応じて訪問者へ見せるブログ記事。
_Avoid_: Article（会話では Post に統一）, entry

**PostBody**:
Post の本文。永続化形式は HTML。
_Avoid_: Markdown body, TipTap JSON, ProseMirror doc（保存形式としては使わない）

**Draft**:
未公開の Post。公開サイトには出ない。
_Avoid_: unpublished（状態名は draft）

**Published Post**:
公開済みの Post。静的サイト生成の対象になる。
_Avoid_: live post

**Profile**:
公開サイトに載せる自己紹介・スキル・プロジェクトなど、コード管理される静的な人物情報。
_Avoid_: About content（画面名ではなく情報そのものを指すときは Profile）

**Blog**:
公開サイトにおける Post の一覧・詳細の読み取り面。
_Avoid_: Posts（公開側の機能名は Blog、管理側の機能名は posts）

**Sanitized HTML**:
許可タグ・属性のみ残した PostBody。API 保存時と公開表示時の両方で生成する。
_Avoid_: raw HTML（永続化・表示にそのまま使わない）

## Example dialogue

Dev: 「Post を公開したら Blog に出る？」
Expert: 「Published Post だけが Blog の対象。Draft は出ない。」

Dev: 「本文は Markdown？」
Expert: 「いや PostBody は HTML。保存前と表示前に Sanitized HTML にする。」

Dev: 「Profile も DB？」
Expert: 「いまはコード管理の静的情報。Blog の Post とは別。」
