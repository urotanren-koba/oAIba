import math
from typing import List, Dict
import googlemaps
from fastapi import HTTPException
from app.core.config import settings

class LocationService:
    def __init__(self):
        self.gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

    def calculate_midpoint(self, locations: List[Dict], transport_mode: str):
        """
        複数の位置情報から中間地点を計算する
        """
        if len(locations) < 2:
            raise HTTPException(status_code=400, detail="2箇所以上の場所を指定してください")

        # 重み付けされた中間地点を計算
        weighted_lat = sum(loc['lat'] for loc in locations) / len(locations)
        weighted_lng = sum(loc['lng'] for loc in locations) / len(locations)

        # 各地点からの距離と所要時間を計算
        travel_times = []
        for loc in locations:
            try:
                result = self.gmaps.distance_matrix(
                    origins=[f"{loc['lat']},{loc['lng']}"],
                    destinations=[f"{weighted_lat},{weighted_lng}"],
                    mode=transport_mode,
                    language="ja"
                )
                
                if result['rows'][0]['elements'][0]['status'] == 'OK':
                    travel_times.append({
                        'from_address': loc['address'],
                        'duration': result['rows'][0]['elements'][0]['duration']['text'],
                        'distance': result['rows'][0]['elements'][0]['distance']['text']
                    })
            except Exception as e:
                print(f"Error calculating distance: {e}")
                continue

        # 周辺のスポットを検索
        try:
            places = self.search_nearby_places(weighted_lat, weighted_lng)
        except Exception as e:
            places = []
            print(f"Error searching places: {e}")

        return {
            'midpoint': {
                'lat': weighted_lat,
                'lng': weighted_lng
            },
            'travel_times': travel_times,
            'places': places
        }

    def search_nearby_places(self, lat: float, lng: float, radius: int = 500):
        """
        指定された座標の周辺施設を検索する
        """
        try:
            result = self.gmaps.places_nearby(
                location=(lat, lng),
                radius=radius,
                type=['restaurant', 'cafe', 'shopping_mall'],
                language='ja'
            )
            
            places = []
            for place in result.get('results', [])[:5]:  # 上位5件を取得
                details = self.gmaps.place(place['place_id'], fields=['name', 'rating', 'formatted_address', 'opening_hours'])
                places.append({
                    'name': place['name'],
                    'place_id': place['place_id'],
                    'address': place.get('vicinity', ''),
                    'rating': place.get('rating', 0),
                    'lat': place['geometry']['location']['lat'],
                    'lng': place['geometry']['location']['lng'],
                    'open_now': details['result'].get('opening_hours', {}).get('open_now', None)
                })
            
            return places
            
        except Exception as e:
            print(f"Error in search_nearby_places: {e}")
            return []
