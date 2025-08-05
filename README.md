# 美容師国家試験 選択式学習ツール

美容師国家試験の過去問を活用した、効率的な学習支援Webアプリケーションです。

## 🎯 特徴

- **科目別学習**: 6つの科目から選択して集中学習
- **過去問ベース**: 実際の過去問を参考にした問題セット
- **進捗管理**: 正答率の表示と学習履歴の追跡
- **詳細解説**: 各問題に対する分かりやすい解説付き
- **レスポンシブデザイン**: PC・スマートフォン対応

## 📚 科目構成

1. **関係法規・制度** (出題割合: 20%)
   - 美容師法、生活衛生関係営業法など

2. **衛生管理技術** (出題割合: 20%)
   - 消毒法、器具の取り扱いなど

3. **公衆衛生・環境衛生** (出題割合: 15%)
   - 生活習慣病、感染症予防など

4. **香粧品化学** (出題割合: 15%)
   - パーマ剤、ヘアカラー、化粧品成分など

5. **美容技術理論** (出題割合: 20%)
   - カット技術、ヘアデザイン、マッサージなど

6. **運営管理** (出題割合: 10%)
   - 美容所の開設、労働基準法、経営管理など

## 🚀 使用方法

### GitHubページでの公開方法

1. **リポジトリの作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 美容師国家試験学習ツール"
   ```

2. **GitHubにプッシュ**
   ```bash
   git remote add origin https://github.com/your-username/beautician-exam-quiz.git
   git push -u origin main
   ```

3. **GitHub Pagesの有効化**
   - リポジトリの Settings → Pages
   - Source を "Deploy from a branch" に設定
   - Branch を "main" に設定
   - Save をクリック

### ローカル開発

```bash
# ローカルサーバーを起動（Python）
python -m http.server 8000

# または Node.js
npx serve

# ブラウザで http://localhost:8000 にアクセス
```

## 📁 ファイル構成

```
beautician-exam-quiz/
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css       # スタイルシート
├── js/
│   └── app.js          # JavaScript機能
├── data/
│   └── questions.json  # 問題データベース
└── README.md           # このファイル
```

## ⚙️ カスタマイズ

### 問題の追加・編集

`data/questions.json` ファイルを編集して問題を追加・修正できます：

```json
{
  "科目名": [
    {
      "id": 1,
      "question": "問題文",
      "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "correct": 1,
      "explanation": "解説文"
    }
  ]
}
```

### スタイルのカスタマイズ

`css/style.css` でデザインをカスタマイズできます。

### 機能の追加

`js/app.js` で新機能を追加できます。

## 🔧 技術仕様

- **HTML5**: セマンティックマークアップ
- **CSS3**: グリッドレイアウト、アニメーション
- **JavaScript ES6+**: モジュール、async/await
- **ローカルストレージ**: 学習進捗の保存
- **レスポンシブデザイン**: モバイルファースト

## 📱 対応ブラウザ

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

プルリクエストや課題の報告を歓迎します！

1. フォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. コミット (`git commit -m 'Add some amazing feature'`)
4. プッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📞 サポート

何か問題があれば、Issueを作成してください。

## 🙏 謝辞

- 美容師国家試験の過去問題は公益財団法人理容師美容師試験研修センターを参考にしています
- フォントは Google Fonts の Noto Sans JP を使用
- アイコンは絵文字を使用

---

美容師国家試験の合格を目指すすべての方を応援しています！📚✨
