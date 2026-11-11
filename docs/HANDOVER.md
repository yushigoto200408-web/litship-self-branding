# 担当者の引き継ぎ

## このリポジトリに含まれるもの

公開中のセルフブランディング6ページと、関連する画像・フォント・教材データです。元の公開ファイル全19件を取り込み、ファイル内容の完全一致を確認しています。元の制作時の会議録、運営用ページ、試作、古いバックアップは含めていません。

コードは `site/` で直接編集できます。Pythonの確認・出力スクリプトは、このリポジトリ自身の場所を基準に動作します。元担当者のユーザー名やMacのパスに依存しません。

## GitHubと公開サイトは別々に引き継ぐ

1. GitHubのリポジトリへのアクセスを、新担当者に渡します。編集を任せる場合はコラボレーターを追加し、完全移管する場合はGitHubのTransfer機能を使います。移管先のユーザー名や組織が必要です。
2. 現在のSitesにも、新担当者が編集・公開できる権限を付与します。GitHubのアクセスや所有権を移しても、Sitesの権限は自動で移りません。Sitesの管理・共有画面で確認してください。
3. 新担当者がローカル表示と公開作業を実行できることを、元担当者のアカウントを停止する前に確認します。
4. 現在のSitesの引き継ぎができない場合は、新担当者または会社が管理する公開先へ `dist/` を公開できます。その際は総合サイトからのリンクも新URLに変更してください。

GitHub公式の案内：
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/inviting-collaborators-to-a-personal-repository
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/transferring-a-repository

## 現在の公開先

- サイト：`https://litship-branding-learning.lit-ship-5264.chatgpt.site/branding/`
- Sites project ID：`appgprj_6ad828b7a5508191b1cd04cd9705e9e2`
- 静的ファイルの公開用ディレクトリ：`dist/`
- `.openai/hosting.json` に既存サイトのIDを保持しています。既存サイトを引き継ぐ場合は、このIDを使います。

CodexでSitesプラグインを利用する場合は、新担当者のアカウントにサイトの編集権限を付けてから、同じIDの既存サイトとして開きます。`site/` の編集、確認、`python3 scripts/build.py` の後、Sitesの手順に従ってソース同期・保存・公開します。GitHubから勝手に本番へ反映する設定は入れていません。

別のホスティングを使う場合も、生成された `dist/` をそのまま静的サイトとして公開できます。ページのパス `/branding/` を保つと、現在のリンク構成を利用できます。

## 外部の申請・Discord

申請先は `https://litship-rank-application.lit-ship-5264.chatgpt.site/apply/branding` です。フォームでは名前、申請ランク、URLや画像を提出します。コメントは任意です。

フォームはDiscordのセルフブランディング申請チャンネルへ投稿し、担当者をメンションする別の公開サービスです。このリポジトリは、そのサービスへのリンクを持っています。

- このリポジトリだけを引き継いでも、申請サービスの所有権や秘密設定は移りません。
- 申請サービスを保守する担当者、公開先の管理権限、Discord Botの管理権限は、別途引き継いでください。
- Botトークンなどの秘密値は、現在の公開先の秘密設定で管理しています。ソースやREADMEへ貼らないでください。
- Discord上の✅を見て認定済み表示に変える処理は、別のBot稼働環境に依存します。このサイトだけで常時動くと見なさず、稼働場所も確認してください。

## 編集後の確認

- 6ページをPC・スマホで開き、レイアウト・写真・教材を確認します。
- ランク一覧、各教材、総合トップへの戻り先、申請フォームへのリンクを確認します。
- ランク条件や相談先を変える場合は、会社側で決まった内容を確認してから反映します。
- `python3 scripts/check.py` でローカルのリンク切れを確認します。
- クイズや学習保存の処理を変える場合は、既存の保存記録を消さずに扱えることを確認します。

新担当者が最初に見る順序：README → このファイル → `site/branding/index.html` → `site/assets/branding.js` と関連CSS。
