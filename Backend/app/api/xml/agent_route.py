# app/api/agent_route.py
import os
from pathlib import Path
from fastapi.responses import FileResponse
from app.schemas.responses import APIResponse
from fastapi import APIRouter, Depends, HTTPException,Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.report import Report
from app.core.security import get_current_user
from app.schemas.AgentReports import AgentReport
from app.models.users import User
from datetime import datetime, timedelta, date
router = APIRouter()
BASE_AGENT_DIR = Path(__file__).parent.parent / "static" 
print(BASE_AGENT_DIR)
@router.post("/bulk-results")
def receive_agent_results(
    data: AgentReport, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Professional Approach: Use bulk_insert_mappings for speed
    report_mappings = [
        {
            "file_name": item.file_name,
            "is_valid": item.is_valid,
            "error_msg": item.error,
            "validated_date": date.today(),
            "file_type": "AGENT_UPLOAD",
            "username": current_user.username
        }
        for item in data.results
    ]
    
    db.bulk_insert_mappings(Report, report_mappings)
    db.commit()
    
    return APIResponse(
        status="success", 
        message=f"Agent report processed: {len(data.results)} files recorded."
    )



@router.get("/download")
async def download_agent(request: Request):
    """
    Detects User OS and returns the appropriate Agent binary.
    """
    user_agent = request.headers.get("User-Agent", "").lower()
    
    # 1. Logic to determine file based on OS
    if "windows" in user_agent:
        file_name = "Windows_Agent.exe"
    elif "macintosh" in user_agent or "darwin" in user_agent:
        file_name = "lmac_agent.zip"
    elif "linux" in user_agent:
        file_name = "Linux_Agent"
    else:
        # Default to Windows or throw error
        file_name = "Windows_Agent.exe"

    file_path = BASE_AGENT_DIR / file_name
    print(file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=404, 
            detail=f"Agent for your OS ({file_name}) is not available on the server."
        )
    
    return FileResponse(
        path=file_path,
        filename=file_name,
        media_type='application/octet-stream'
    )