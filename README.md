# oAIba

最適な待ち合わせ場所を見つけるアプリケーション

## 機能

- 複数人（最大4人）の出発地点から最適な中間地点を計算
- Google Maps APIを使用した視覚的な地図表示
- 周辺施設の検索と提案
- OpenAI APIを活用した待ち合わせ場所の提案文生成

## 技術スタック

### フロントエンド
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Google Maps JavaScript API

### バックエンド
- Python
- FastAPI
- OpenAI API
- Google Maps API

## セットアップ

1. リポジトリのクローン
```bash
git clone https://github.com/urotanren-koba/oAIba.git
cd oAIba
```

2. バックエンドのセットアップ
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. 環境変数の設定
- `.env` ファイルをバックエンドディレクトリに作成し、必要なAPIキーを設定
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. アプリケーションの起動
```bash
# バックエンド
uvicorn app.main:app --reload

# フロントエンド
# Live Serverなどを使用してindex.htmlを開く
```

## 使用方法

1. ホーム画面で「START」ボタンをクリック
2. 住所または場所名を入力（最大4箇所）
3. 移動手段（徒歩/電車/車）を選択
4. 自動的に最適な中間地点が計算され、地図上に表示
5. AIによる待ち合わせ場所の提案を確認

## ライセンス

MIT License