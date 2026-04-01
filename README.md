# PitchLink 📬

> 営業電話をゼロにする、次世代ビジネスコンタクトプラットフォーム

## 概要

PitchLink は「営業電話をなくす」ことを目的としたビジネスコンタクトプラットフォームです。

- **営業側**：電話ではなく、資料を送ることで成約率を高める
- **受信側**：資料を先読みし、本当に必要な会社だけに連絡を返す

各企業・部署に固有の URL を発行し、HPに設置するだけで利用できます。

```
https://pitchlink.app/company/{company-slug}
https://pitchlink.app/company/{company-slug}/dept/{dept-id}
```

---

## 主な機能

### 🏢 企業マイページ
- 会社概要・ロゴ・業種の表示
- 部署ごとの受け取り設定（マーケ、人事、システムなど）
- 受け取り拒否・フィルタリング設定

### 📬 タイムライン（受信ボックス）
- 営業側が送った資料・自己紹介を時系列で表示
- カテゴリフィルタリング（マーケ / システム / 人事 / 経営 など）
- 既読・未読管理

### 📎 資料送信
- PDF / 動画 / リンクを添付して送付
- 送付先部署の指定
- テンプレート機能（営業側の効率化）

### 🔔 通知機能
- 新着資料のメール通知
- Slack / ChatWork 連携（Webhook）

### 💾 保存・管理
- 気になった資料をブックマーク
- マイページの「保存済み」に一覧表示
- 資料の破棄・ブロック

### 📞 コンタクト機能
- 興味を持った場合のみ連絡先を開示
- メール / Slack / ChatWork などの連絡先を自動表示
- 企業側が連絡手段を事前設定

### 🚨 報告機能
- スパム・不適切な資料の報告
- 送信元のブロック

---

## Tech Stack

| レイヤー | 技術 |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State管理 | Zustand |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| 認証 | Clerk / Auth.js |
| ファイルストレージ | Cloudflare R2 / AWS S3 |
| 通知 | Resend (メール) + Slack Webhook |
| Hosting | Vercel (Frontend) + Railway (Backend) |

---

## ディレクトリ構成

```
pitchlink/
├── frontend/          # React フロントエンド
│   └── src/
│       ├── pages/     # ページコンポーネント
│       ├── components/# 共通コンポーネント
│       ├── hooks/     # カスタムフック
│       ├── types/     # TypeScript 型定義
│       └── utils/     # ユーティリティ関数
├── backend/           # Express バックエンド
│   └── src/
│       ├── routes/    # APIルーティング
│       ├── models/    # データモデル
│       ├── middleware/# 認証・バリデーション
│       └── utils/     # ユーティリティ
├── docs/              # ドキュメント・仕様書
└── .github/           # GitHub Actions / Issue テンプレート
```

---

## ローカル開発環境のセットアップ

### 前提条件

- Node.js 18+
- PostgreSQL 14+
- pnpm (推奨) または npm

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-org/pitchlink.git
cd pitchlink

# フロントエンドの依存関係
cd frontend
pnpm install

# バックエンドの依存関係
cd ../backend
pnpm install
cp .env.example .env  # 環境変数の設定
```

### 環境変数の設定

`backend/.env` を編集してください：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pitchlink"
JWT_SECRET="your-jwt-secret"
RESEND_API_KEY="your-resend-api-key"
R2_BUCKET_NAME="pitchlink-files"
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret"
```

### 起動

```bash
# バックエンド
cd backend
pnpm dev  # http://localhost:3001

# フロントエンド（別ターミナル）
cd frontend
pnpm dev  # http://localhost:5173
```

---

## API エンドポイント（設計）

```
# 企業
GET    /api/companies/:slug          - 企業マイページ取得
POST   /api/companies                - 企業登録
PATCH  /api/companies/:id            - 企業情報更新

# 部署
GET    /api/companies/:id/departments
POST   /api/companies/:id/departments

# タイムライン（ピッチ）
GET    /api/pitches?companyId=&dept=  - ピッチ一覧（フィルタ付き）
POST   /api/pitches                   - ピッチ送信
PATCH  /api/pitches/:id/save          - 保存
PATCH  /api/pitches/:id/dismiss       - 破棄
POST   /api/pitches/:id/report        - 報告
POST   /api/pitches/:id/block         - ブロック

# 通知
GET    /api/notifications
PATCH  /api/notifications/:id/read
```

---

## データモデル（ER図）

```
Company
  id, slug, name, description, logo_url, industry, created_at

Department
  id, company_id, name, category, contact_email, slack_webhook

Pitch (営業資料)
  id, sender_id, company_id, dept_id, title, body,
  attachments[], category, status, created_at

User (営業側)
  id, name, company_name, email, avatar_url

Notification
  id, user_id, pitch_id, type, read, created_at
```

---

## ロードマップ

- [ ] MVP: 企業マイページ + ピッチ送信 + タイムライン
- [ ] 通知機能（メール）
- [ ] Slack / ChatWork 連携
- [ ] 保存・ブロック機能
- [ ] モバイル対応
- [ ] 分析ダッシュボード（開封率など）
- [ ] 独自ドメイン対応

---

## コントリビューション

Issue・PR 歓迎です。詳細は [CONTRIBUTING.md](./docs/CONTRIBUTING.md) をご覧ください。

---

## ライセンス

MIT License
