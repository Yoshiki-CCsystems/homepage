# 開発支援ページ 設計メモ（GPT向け実装指示）

- 作成日: 2026-05-04
- 作成者: Opus（Claude）
- 宛先: GPT
- 作業ブランチ: `feature/dev-support-page`（worktree: `homepage.wt/dev-support-page`）
- 関連仕様（Index_Guardian 側、参考）:
  - `Index_Guardian/docs/features/20260501_payments/index_guardian_developer_support_spec.md`
  - `Index_Guardian/docs/communication/FromOpus_20260504_developer_support_rollout_plan.md`
- 実装対象リポジトリ: `homepage`（公開先 `https://cc-systems.co.jp/`）

---

## 0. 結論サマリー

- `product.html` を改修して「概要・無料明記」を冒頭に追加し、末尾に開発支援ページへの控えめな導線を入れる
- `support.html` を新規作成し、開発支援の専用ランディングとする（Stripe Payment Link はここに集約）
- `index-guardian.html`（既存の Index Guardian 詳細ページ）は **変更しない**
- グローバルナビには「開発支援」を入れない（押し売り感回避）
- アプリ側 `appsettings.json` には下記 URL を埋め込む想定:
  - `OfficialSiteUrl` = `https://cc-systems.co.jp/product.html`
  - `SupportPageUrl`  = `https://cc-systems.co.jp/support.html`

---

## 1. 背景

Index Guardian は無料・オフライン利用を想定した OSS 的な業務 Web アプリ。継続開発と保守には費用と時間が掛かるため、**任意の開発支援**を Stripe Payment Link で受け付けたい。アプリ内に Stripe URL を直接埋め込まず、公式ホームページの支援ページ URL を埋め込むことで、Stripe URL が変わっても HP 側だけで切り替えできるようにする（仕様書 §83-84）。

そのため、ホームページ側に下記 2 ページが必要になる:

1. プロダクト紹介ページ（既存 `product.html` の改修）
2. 開発支援ページ（新規 `support.html`）

---

## 2. 既存サイト構成（前提）

| ファイル | 役割 | 今回の変更 |
|---|---|---|
| `index.html` | トップ | 変更なし |
| `service.html` | サービス | 変更なし |
| `product.html` | プロダクト紹介（Index Guardian 中心） | **改修** |
| `index-guardian.html` | Index Guardian 詳細 | **変更なし** |
| `about.html` | 代表挨拶 | 変更なし |
| `company.html` | 会社概要 | 変更なし |
| `support.html` | 開発支援（新規） | **新規作成** |

CSS 構成:
- `index-simple.css` … 共通スタイル（ヘッダー、ボタン、ヒーロー、フッター、`.section` など）
- `product-simple.css` … `product.html` 専用追加スタイル
- `support-simple.css`（新規） … `support.html` 専用追加スタイル
- 既存配色: `--accent: #1e6fd9` / `--accent-soft: #eaf3ff`、フォント: Manrope + Noto Sans JP

---

## 3. Stripe Payment Link 情報（控え）

| 項目 | 値 |
|---|---|
| URL | `https://buy.stripe.com/9B68wJ5tA55aa5lepp6Ri00` |
| 商品名 | Index Guardian開発支援 |
| 通貨 | JPY |
| 金額 | 顧客選択（最小 ¥500、最大 ¥50,000、デフォルト ¥3,000） |
| ステータス | 有効 |
| 決済手段 | カード |

ボタン仕様:
- 文言: **「開発支援する（Stripeで決済）」**
- `target="_blank" rel="noopener noreferrer"` で別タブ
- ボタン下に補足テキスト: **「¥500 から ¥50,000 まで、お気持ちで金額を選べます。デフォルトは ¥3,000 です。」**

---

## 4. `product.html` 改修内容

### 4.1 セクション構成（改修後）

| # | セクション | 状態 | 内容 |
|---|---|---|---|
| 1 | Hero | コピー差し替え | 「無料で使える、インフラ運用のための Web アプリ」を打ち出す |
| 2 | **Overview / 無料明記**（新規） | ➕ | Index Guardian の一言説明 + 無料・オフライン利用想定・機能制限なし |
| 3 | Featured Product (Index Guardian) | そのまま | 既存 showcase（ダッシュボード画像付き） |
| 4 | こんな課題に向いています / 主な機能 | そのまま | 既存 summary cards |
| 5 | 想定シーン / 権限設計 | そのまま | 既存 table cards |
| 6 | **開発支援について**（新規・控えめ） | ➕ | 短い見出し + `support.html` への CTA リンクのみ。Stripe ボタンは置かない |
| 7 | 末尾 CTA | そのまま | 既存 note panel（相談 CTA） |

### 4.2 セクション 1（Hero）コピー案

```
Product
Index Guardian
無料で使える、インフラ運用のための Web アプリ

設計書、機器台帳、EOSL、課題管理を一つの流れで扱える、
インフラエンジニア向けの実務アプリです。
個人・法人を問わず無料で利用でき、オフライン環境でも動作します。
```

`<p class="section-label">` は `Product` のまま、`<h1>` は `Index Guardian` に差し替え可（または「プロダクト」維持で `<h2>` に Index Guardian を置く）。判断は GPT に任せる。

### 4.3 セクション 2（Overview / 無料明記）— 新規

新規 callout カードを 1 枚追加。**強調しすぎず、しかし無料であることが明確に伝わる**トーン。

```html
<section class="section">
  <div class="container">
    <div class="overview-callout">
      <p class="section-label">Overview</p>
      <h2>無料で利用できます</h2>
      <p>
        Index Guardian は、個人・法人を問わず <strong>無料</strong> で利用できます。
        オフライン環境（社内ネットワークや閉域網）での運用を想定しており、
        導入後にライセンス料や利用料が発生することはありません。
      </p>
      <ul class="overview-points">
        <li><i class="fa-solid fa-check"></i>機能制限なし。すべての機能を使えます</li>
        <li><i class="fa-solid fa-check"></i>オフライン環境で動作します（インターネット接続不要）</li>
        <li><i class="fa-solid fa-check"></i>利用日数や操作内容を外部に送信しません</li>
      </ul>
    </div>
  </div>
</section>
```

### 4.4 セクション 6（開発支援について）— 新規・控えめ

末尾 CTA の前に、**短く** 1 セクション挿入。Stripe ボタンは置かず、`support.html` への導線のみ。

```html
<section class="section" id="support">
  <div class="container">
    <div class="support-link-panel">
      <p class="section-label">Optional</p>
      <h2>開発支援のお願い</h2>
      <p>
        Index Guardian は無料で提供していますが、継続的な開発・保守・検証には
        費用と時間がかかっています。もしお役に立てていれば、
        任意で開発支援をご検討いただけると励みになります。
      </p>
      <p class="support-link-note">
        支援の有無で機能差や利用可否は変わりません。
      </p>
      <div class="hero-actions">
        <a class="btn btn-secondary" href="support.html">開発支援について</a>
      </div>
    </div>
  </div>
</section>
```

### 4.5 既存セクションで触らない部分

- Featured Product showcase の文言・画像
- 機能 summary cards の文言
- 権限設計 table cards の文言
- 末尾 note panel の文言（必要なら「メールで相談する」と並列で「開発支援について」を入れても可、ただし末尾は相談導線が主役なので原則そのまま）

### 4.6 メタ情報

```html
<meta name="description" content="Index Guardian は、設計書管理、機器のEOSL管理、課題管理を一つにまとめる無料のインフラ運用向けWebアプリケーションです。">
<title>Index Guardian | 株式会社CCシステムズ</title>
```

`<title>` を「プロダクト | …」→「Index Guardian | …」に変更（製品単体ページに性格が寄るため）。

---

## 5. `support.html` 新規作成

### 5.1 ページの目的

- **アプリから飛んでくる訪問者**に対し、開発支援の意図と条件をすぐ理解してもらう
- Stripe Payment Link への導線を 1 箇所に集約する
- 押し売り感を避け、丁寧で控えめな文面にする

### 5.2 セクション構成

| # | セクション | 内容 |
|---|---|---|
| 1 | Page Hero | 「開発支援について」 + 一言リード |
| 2 | Index Guardian は無料です | 仕様書 §105 の「無料・オフライン・支援有無で機能差なし」 |
| 3 | なぜ支援をお願いしているか | 「継続的な開発・保守・検証に費用と時間が掛かる」 |
| 4 | 支援方法（Stripe） | Stripe Payment Link ボタン + 金額レンジ補足 + 注意事項 |
| 5 | 支援に関する Q&A 風の補足 | 領収書・請求書 / 機能差なし / カード情報をアプリ内で扱わない |
| 6 | 末尾 | アプリへ戻る導線、`product.html` への導線、メール相談 |

### 5.3 ヘッダー・ナビ

- ヘッダーは既存サイトと共通（`site-header`、`brand`、`site-nav`）
- グローバルナビには「開発支援」を入れない（仕様書 §503-§516）
- `support.html` は `<nav>` の `aria-current` を持たせず、ナビからは独立した導線として扱う

### 5.4 各セクションの文面案（仕様書 §105 準拠）

#### Page Hero

```
Optional
開発支援について

Index Guardian は無料で提供しています。継続的な開発・保守・検証への
任意の支援を、Stripe の決済ページで受け付けています。
```

#### セクション 2: Index Guardian は無料です

```html
<section class="section">
  <div class="container">
    <div class="support-card">
      <p class="section-label">Free to Use</p>
      <h2>Index Guardian は無料です</h2>
      <p>
        Index Guardian は、個人・法人を問わず無料で利用できます。
        オフライン環境（社内ネットワークや閉域網）での運用を想定しており、
        導入後にライセンス料や利用料は発生しません。
      </p>
      <p>
        開発支援の有無で、機能差や利用可否が変わることはありません。
        支援は完全に任意です。
      </p>
    </div>
  </div>
</section>
```

#### セクション 3: なぜ支援をお願いしているか

```html
<section class="section">
  <div class="container">
    <div class="support-card">
      <p class="section-label">Why</p>
      <h2>継続的な開発・保守・検証のために</h2>
      <p>
        Index Guardian は無料で提供していますが、機能の追加、不具合の修正、
        新しい OS や .NET バージョンへの追随、セキュリティ確認などの作業には
        継続的に費用と時間がかかっています。
      </p>
      <p>
        もし日々の運用でお役に立てていれば、任意で開発支援をご検討いただけると
        今後の継続開発の励みになります。
      </p>
    </div>
  </div>
</section>
```

#### セクション 4: 支援方法（Stripe）

```html
<section class="section">
  <div class="container">
    <div class="support-cta-panel">
      <p class="section-label">How</p>
      <h2>Stripe の決済ページから支援できます</h2>
      <p>
        支援は、外部決済サービス Stripe の決済ページで受け付けています。
        金額は ¥500 から ¥50,000 までの範囲でお選びいただけます（デフォルトは ¥3,000）。
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary"
           href="https://buy.stripe.com/9B68wJ5tA55aa5lepp6Ri00"
           target="_blank"
           rel="noopener noreferrer">
          開発支援する（Stripeで決済）
        </a>
      </div>
      <p class="support-cta-note">
        ボタンを押すと Stripe の決済ページが新しいタブで開きます。
        カード情報は Stripe 側で扱われ、Index Guardian アプリや本サイトには保存されません。
      </p>
    </div>
  </div>
</section>
```

#### セクション 5: 補足（Q&A 風）

```html
<section class="section">
  <div class="container">
    <div class="support-faq">
      <p class="section-label">Notes</p>
      <h2>支援に関する補足</h2>
      <dl class="faq-list">
        <dt>領収書や請求書は発行されますか？</dt>
        <dd>Stripe の決済完了画面から領収書を取得できます。請求書が必要な場合は Stripe の案内に従ってください。</dd>

        <dt>支援すると追加機能が使えるようになりますか？</dt>
        <dd>いいえ。Index Guardian は支援の有無で機能差や利用可否が変わりません。すべての機能を無料で使えます。</dd>

        <dt>カード情報はアプリ内で入力するのですか？</dt>
        <dd>いいえ。決済はすべて Stripe の外部ページで行われます。Index Guardian アプリ内ではカード情報や口座情報を扱いません。</dd>

        <dt>支援の頻度や金額に決まりはありますか？</dt>
        <dd>いいえ。一度きりでも、お気持ちに応じた金額で構いません。継続的なサブスクリプションではありません。</dd>
      </dl>
    </div>
  </div>
</section>
```

#### セクション 6: 末尾

```html
<section class="section">
  <div class="container">
    <div class="support-footer-actions">
      <a class="btn btn-secondary" href="product.html">Index Guardian の紹介ページへ</a>
      <a class="btn btn-secondary" href="mailto:info@cc-systems.co.jp">メールで問い合わせる</a>
    </div>
  </div>
</section>
```

### 5.5 メタ情報

```html
<meta name="description" content="Index Guardian の開発支援についてのご案内。無料で提供しているアプリの継続的な開発・保守を、任意の支援で支えていただけます。決済は Stripe の外部ページで行います。">
<title>開発支援について | Index Guardian | 株式会社CCシステムズ</title>
```

### 5.6 全体テンプレート（骨組み）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="…（5.5 を参照）">
  <title>開発支援について | Index Guardian | 株式会社CCシステムズ</title>
  <link rel="stylesheet" href="index-simple.css">
  <link rel="stylesheet" href="support-simple.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
  <header class="site-header">
    <!-- 既存ページと同じ -->
  </header>

  <main>
    <!-- セクション 1〜6（5.4 を参照） -->
  </main>

  <footer class="site-footer">
    <!-- 既存ページと同じ -->
  </footer>
</body>
</html>
```

---

## 6. CSS 方針

### 6.1 `product-simple.css` への追加クラス

既存のトーン（白背景カード、`--shadow`、角丸 24px）を踏襲。

```css
/* === Overview callout（4.3） === */
.overview-callout {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--accent);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 32px;
}

.overview-callout h2 {
  margin: 10px 0 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  letter-spacing: -0.04em;
}

.overview-callout p {
  margin: 14px 0 0;
  color: var(--text-soft);
}

.overview-callout p strong {
  color: var(--accent);
  font-weight: 700;
}

.overview-points {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.overview-points li {
  display: flex;
  gap: 10px;
  color: var(--text-soft);
}

.overview-points i {
  margin-top: 6px;
  color: var(--accent);
}

/* === Support link panel（4.4） === */
.support-link-panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 32px;
}

.support-link-panel h2 {
  margin: 10px 0 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  letter-spacing: -0.04em;
}

.support-link-panel p {
  margin: 14px 0 0;
  color: var(--text-soft);
}

.support-link-note {
  font-size: 0.9rem;
  color: var(--text-soft);
}

@media (max-width: 640px) {
  .overview-callout,
  .support-link-panel {
    padding: 24px;
  }
}
```

### 6.2 `support-simple.css`（新規）

`product-simple.css` と同様のトーンで、support 専用のクラスを定義。

```css
.site-nav a.active {
  color: var(--text);
  font-weight: 700;
}

.page-hero {
  padding: 56px 0 24px;
}

.page-hero h1 {
  margin: 10px 0 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.page-lead {
  max-width: 780px;
  margin: 16px 0 0;
  color: var(--text-soft);
  font-size: 1rem;
}

/* === Support card（5.4 セクション 2, 3） === */
.support-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 32px;
}

.support-card h2 {
  margin: 10px 0 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  letter-spacing: -0.04em;
}

.support-card p {
  margin: 14px 0 0;
  color: var(--text-soft);
}

/* === Support CTA panel（5.4 セクション 4） === */
.support-cta-panel {
  background: linear-gradient(135deg, #123764 0%, #1e6fd9 100%);
  border-radius: 24px;
  padding: 40px 32px;
  color: #fff;
  text-align: center;
}

.support-cta-panel .section-label {
  color: rgba(255, 255, 255, 0.85);
}

.support-cta-panel h2 {
  margin: 10px 0 0;
  font-family: "Manrope", sans-serif;
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  letter-spacing: -0.04em;
}

.support-cta-panel p {
  margin: 14px auto 0;
  max-width: 640px;
  color: rgba(255, 255, 255, 0.92);
}

.support-cta-panel .hero-actions {
  justify-content: center;
}

.support-cta-panel .btn-primary {
  background: #fff;
  color: var(--accent);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
}

.support-cta-note {
  margin-top: 18px;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.85);
}

/* === FAQ（5.4 セクション 5） === */
.support-faq {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 32px;
}

.support-faq h2 {
  margin: 10px 0 22px;
  font-family: "Manrope", sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  letter-spacing: -0.04em;
}

.faq-list {
  margin: 0;
  display: grid;
  gap: 18px;
}

.faq-list dt {
  font-weight: 700;
  color: var(--text);
}

.faq-list dd {
  margin: 8px 0 0;
  color: var(--text-soft);
}

/* === Footer actions（5.4 セクション 6） === */
.support-footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

@media (max-width: 640px) {
  .support-card,
  .support-cta-panel,
  .support-faq {
    padding: 24px;
  }

  .support-footer-actions {
    flex-direction: column;
  }

  .support-footer-actions .btn {
    width: 100%;
  }
}
```

---

## 7. 文言ルール（必読）

仕様書 §38, §503-§516, §531 準拠。

| ルール | 理由 |
|---|---|
| **「寄付」ではなく「開発支援」**で統一 | 仕様書 §38, §531 の表現統一 |
| 「ご支援ください」より「ご検討いただけると励みになります」など、押しつけない表現 | §503-§516「押し売り感を避ける」 |
| 「無料で使える」「機能制限なし」「支援の有無で機能差なし」を必ず明示 | §105、誤解防止 |
| 「外部決済（Stripe）で行う」「アプリ内ではカード情報を扱わない」を明示 | §105、安心材料 |
| 機能要求や利用条件を支援に紐付けない | EULA 第4条 5項「対価関係を発生させない」 |

---

## 8. アクセシビリティ・レスポンシブ

- すべてのリンク・ボタンに視認可能なフォーカススタイル（既存 CSS の挙動に従う）
- Stripe ボタンは外部リンクであることを明示（文言「Stripeで決済」+ 補足テキスト）
- レスポンシブブレークポイント: `@media (max-width: 900px)` で 1 カラム化、`@media (max-width: 640px)` でパディング縮小・ボタン縦並び（既存の `index-simple.css` / `product-simple.css` と同じ）
- カラーコントラスト: 白背景 × `--text` (#1b2432)、グラデーション背景 × `#fff` のいずれも WCAG AA を満たす
- `<dl>` を使った FAQ は意味的にも適切（質問:回答のペア）

---

## 9. ファイル文字コード

- すべて **UTF-8 (BOM なし)** で保存すること
- 既存ファイル（`product.html`、`index-simple.css` など）も UTF-8 BOM なしのため、揃える
- BOM を付けるとブラウザによっては表示崩れの原因になる

---

## 10. 完了条件

- [ ] `product.html` に Overview / 無料明記セクションが追加されている
- [ ] `product.html` 末尾付近に `support.html` への控えめな導線セクションがある
- [ ] `product.html` の `<title>` と `<meta description>` が更新されている
- [ ] `product-simple.css` に `.overview-callout` `.support-link-panel` 系クラスが追加されている
- [ ] `support.html` が新規作成されている（5.6 のテンプレート構造）
- [ ] `support-simple.css` が新規作成されている
- [ ] `support.html` の Stripe ボタンから `https://buy.stripe.com/9B68wJ5tA55aa5lepp6Ri00` に遷移する（別タブ）
- [ ] グローバルナビには「開発支援」が **追加されていない**
- [ ] `index-guardian.html` は **変更されていない**
- [ ] ローカルプレビュー（`python -m http.server` 等）で両ページが崩れず表示される
- [ ] スマートフォン幅（375px）でも読める

---

## 11. やらないこと

- グローバルナビへの「開発支援」追加
- `index-guardian.html` の変更
- Stripe URL のハードコード（HTML 内に直接書くのはこの 1 箇所だけ。アプリ側には絶対に書かない）
- 「寄付」「ご支援ください」など押し売りトーンの文言
- 「支援者限定機能」「支援額に応じた特典」などの文言（仕様書 §31-§34 の禁止事項）
- 利用日数・操作内容の外部送信（HP 側はそもそも関係ないが、文言レベルで「外部送信しない」と書くのは OK）
- フッターからの新規導線追加（既存フッター構造は維持）

---

## 12. アプリ側 `appsettings.json` 反映用 URL

このページが公開された後、Index_Guardian アプリ側の `appsettings.json` の `DeveloperMessage` セクションに下記を入れる:

```json
{
  "DeveloperMessage": {
    "Enabled": true,
    "IntervalDays": 90,
    "FirstDisplayAfterDays": 30,
    "ShowOnlyToAdministrators": true,
    "AllowDisablePermanently": true,
    "OfficialSiteUrl": "https://cc-systems.co.jp/product.html",
    "SupportPageUrl": "https://cc-systems.co.jp/support.html"
  }
}
```

この設定は **Index_Guardian リポジトリ側の作業**（Step 2）。本ホームページ作業の完了を待ってから着手する。

---

## 13. 引き継ぎ事項

- 実装後は `feature/dev-support-page` ブランチで PR を作成し、マスターのレビューを受ける
- コミットはレビュー完了後（CLAUDE.md ルール）
- ローカルプレビューは Python 簡易サーバーが手軽:
  ```powershell
  cd C:\Users\Administrator\Desktop\Claude\Dev\homepage.wt\dev-support-page
  python -m http.server 8000
  # ブラウザで http://localhost:8000/product.html と http://localhost:8000/support.html
  ```
- 配色・字面で迷ったら、既存 `product.html` / `index-guardian.html` のトーンを基準にする
- 文言は **必ず仕様書 §105 と本書セクション 7 のルール**を満たすこと
- 不明点があれば `docs/communication/FromGPT_yyyymmdd_xxxxxx.md` で Opus に質問してください

以上。
