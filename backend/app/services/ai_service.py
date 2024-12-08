import openai
from app.core.config import settings

class AIService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    async def generate_meeting_suggestion(self, midpoint_data):
        """
        中間地点データを基に待ち合わせ場所の提案文を生成
        """
        try:
            context = self._create_context(midpoint_data)
            
            # システムプロンプトをより詳細に設定
            system_prompt = """
            あなたは最適な待ち合わせ場所を提案するアシスタントです。
            以下の要素を含めて、具体的で実用的な提案を行ってください：

            1. 導入部分：
               - 「中間地点は[地域名]です。最寄駅は[駅名]駅（[路線名]）です。」
               - 駅からの徒歩時間も含める

            2. 周辺施設の紹介（以下の要素を含める）：
               - カフェやレストランなど、待ち合わせに適した施設を2-3個
               - 各施設の特徴（例：雰囲気、価格帯、人気メニューなど）
               - 営業時間やおすすめの時間帯
               - 座席数や混雑状況の目安

            3. 実用的な情報：
               - 待ち合わせ場所の目印や特徴
               - 雨天時の代替案
               - 休日と平日で異なる場合は、その違い

            4. 最後に：
               - 「住所：[正確な住所]」を記載

            文体：
            - 友人との会話のような親しみやすい口調
            - 簡潔だが必要な情報は漏らさない
            - 3-4つの段落に分けて読みやすく構成
            """

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": context}
                ]
            )
            
            return response.choices[0].message['content']

        except Exception as e:
            print(f"Error in AI suggestion: {e}")
            # デフォルトの提案文を返す
            return self._generate_default_suggestion(midpoint_data)

    def _create_context(self, midpoint_data):
        """
        AIへの入力となるコンテキスト情報を作成
        """
        if not midpoint_data.get('places'):
            return "周辺施設の情報が取得できませんでした。"

        # 移動時間情報を含める
        travel_times = "\n".join([
            f"- {time['from_address']}からの移動時間: {time['duration']}"
            for time in midpoint_data.get('travel_times', [])
        ])

        # 周辺施設情報を含める
        places_info = "\n".join([
            f"- {place['name']}\n" +
            f"  評価: {place.get('rating', '評価なし')}星\n" +
            f"  住所: {place.get('address', '不明')}\n" +
            f"  営業: {'営業中' if place.get('open_now') else '営業時間不明'}"
            for place in midpoint_data.get('places', [])
        ])

        # 位置情報を含める
        midpoint = midpoint_data.get('midpoint', {})
        context = f"""
【中間地点の情報】
緯度: {midpoint.get('lat')}
経度: {midpoint.get('lng')}

【参加者からの移動時間】
{travel_times}

【周辺の施設情報】
{places_info}

これらの情報を元に、待ち合わせ場所として最適な提案を作成してください。
特に、移動時間のバランスと周辺施設の利便性を考慮してください。
"""
        return context

    def _generate_default_suggestion(self, midpoint_data):
        """
        APIエラー時のデフォルト提案文を生成
        """
        try:
            midpoint = midpoint_data.get('midpoint', {})
            places = midpoint_data.get('places', [])
            travel_times = midpoint_data.get('travel_times', [])
            
            # 利用可能な情報から基本的な提案文を生成
            if places and travel_times:
                main_place = places[0]
                times_info = ", ".join([f"{t['from_address']}から{t['duration']}" for t in travel_times])
                return f"中間地点は{main_place['name']}付近です。{times_info}でアクセス可能です。周辺には{', '.join(p['name'] for p in places[:3])}などがあります。住所：{main_place.get('address', '住所情報なし')}"
            else:
                return f"中間地点の座標は緯度{midpoint.get('lat'):.6f}、経度{midpoint.get('lng'):.6f}付近です。"
        except:
            return "申し訳ありません。中間地点の情報を取得できませんでした。"