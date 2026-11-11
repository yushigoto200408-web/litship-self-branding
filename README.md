# Lit Ship セルフブランディング

最新版の公開サイトを、そのまま別の担当者が引き継いで編集できるリポジトリです。2026年11月11日時点で確認した公開版 v31 を収録しています。

- 公開サイト：<https://litship-branding-learning.lit-ship-5264.chatgpt.site/branding/>
- 昇格申請：<https://litship-rank-application.lit-ship-5264.chatgpt.site/apply/branding>
- 総合プログラム：<https://litship-all-in-one-program.lit-ship-5264.chatgpt.site/>

## 最初に動かす

Python 3があれば、追加のライブラリは必要ありません。リポジトリのフォルダで実行します。

```sh
python3 scripts/check.py
python3 -m http.server 8000 --directory site
```

ブラウザで <http://localhost:8000/branding/> を開いてください。Windowsで `python3` が見つからない場合は `python` に置き換えます。

## 編集する場所

**`site/` がこのリポジトリの編集元です。** HTML・CSS・JavaScriptを直接編集します。変更前のMacや、他のCodexチャットのファイルは必要ありません。

| 場所 | 内容 |
| --- | --- |
| `site/branding/index.html` | トップ・ランク一覧 |
| `site/branding/basic/index.html` | ランク01 |
| `site/branding/associate/index.html` | ランク02 |
| `site/branding/professional/index.html` | ランク03 |
| `site/branding/expert/index.html` | ランク04 |
| `site/branding/ambassador/index.html` | ランク05 |
| `site/assets/` | デザイン、動作、教材データ、画像、フォント |
| `docs/HANDOVER.md` | 公開と権限の引き継ぎ、接続先の説明 |
| `docs/snapshot.json` | 取り込んだ公開版のIDとファイル照合用の記録 |

各ページには、ファイル単体で学習できるよう教材データが埋め込まれている箇所があります。教材や条件を変える場合は、ページ本文、`brand-page-data`、`assets/brand-stages.json` の関連箇所を確認してください。

以前のMacにあった生成処理を実行すると旧版を再生成するおそれがあります。このリポジトリでは `site/` を正本として続けて編集してください。

## 確認して公開用に出力する

```sh
python3 scripts/check.py
python3 scripts/build.py
```

`dist/` に公開用のファイルが出ます。GitHubへpushするだけでは、現在の公開サイトは更新されません。公開権限を持つ担当者が `dist/` を既存のSitesへ反映します。詳しくは [HANDOVER.md](docs/HANDOVER.md) を参照してください。

取り込んだ直後の公開版との完全一致を確認する場合だけ、`python3 scripts/check.py --snapshot` を使います。編集後に一致しなくなるのは正常です。

## 制度・運用の前提

- 学生、副業でLit Shipに参加するメンバー、マイメンが対象です。
- ランクはベーシック → アソシエイト → プロフェッショナル → エキスパート → アンバサダーの5段階です。
- 相談先は北浦さんを先頭に、北浦さん・後藤さんの順です。
- 条件を満たしてフォームから申請し、北浦さんまたは後藤さんが確認する案内です。
- 人数・期限・自動降格・報酬保証など、未承認の条件を追加しないでください。
- 総合の営業・AIとの複合条件は、総合サイトの参加条件一覧で扱っています。ここだけを変更して別の条件を作らないようにしてください。

## 秘密情報

Botトークン、ログイン情報、申請者の提出物・審査記録は含めていません。申請フォームとDiscord Botの実装は別システムです。接続先URLは上記のとおりです。
