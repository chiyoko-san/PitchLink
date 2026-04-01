#!/bin/bash
# PitchLink を GitHub にアップするスクリプト
# 使い方: bash setup-git.sh https://github.com/your-org/pitchlink.git

REMOTE_URL=$1

if [ -z "$REMOTE_URL" ]; then
  echo "❌ リモートURLを指定してください"
  echo "例: bash setup-git.sh https://github.com/your-org/pitchlink.git"
  exit 1
fi

echo "🚀 Git リポジトリを初期化中..."
git init
git add .
git commit -m "feat: initial commit - PitchLink MVP scaffold"

git branch -M main
git remote add origin "$REMOTE_URL"
git push -u origin main

echo "✅ GitHub へのアップロードが完了しました！"
echo "🔗 $REMOTE_URL"
