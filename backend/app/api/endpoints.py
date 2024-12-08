from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from app.services.location_service import LocationService
from app.services.ai_service import AIService

router = APIRouter()
location_service = LocationService()
ai_service = AIService()

class LocationRequest(BaseModel):
    locations: List[Dict]
    transport_mode: str

@router.post("/calculate-midpoint")
async def calculate_midpoint(request: LocationRequest):
    try:
        # 中間地点を計算
        result = location_service.calculate_midpoint(
            request.locations,
            request.transport_mode
        )
        
        # AI提案を生成
        suggestion = await ai_service.generate_meeting_suggestion(result)
        
        # 結果を結合
        result['suggestion'] = suggestion
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))