from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, cast, Integer,case
from datetime import datetime, timedelta, date
from typing import List,Dict,Any
import time

from app.database import get_db
from app.models.report import Report # Ensure this matches your model name
from app.models.users import User
from app.core.security import get_current_user
from app.schemas.xml import URLUpload,ReportResponse
from app.services.xml_service import validate_xml_all_errors, validate_xml_from_url, url_validation
from app.schemas.responses import APIResponse

router = APIRouter()

@router.get("/", response_model=APIResponse[List[ReportResponse]]) 
def get_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reports = db.query(Report)\
        .filter(Report.username == current_user.username)\
        .order_by(desc(Report.validated_date))\
        .all()
    
    return APIResponse(
        status="success",
        message="Reports retrieved successfully",
        data=reports 
    )

@router.delete("/{file_id}", response_model=APIResponse)
def delete_validation(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a validation report by ID"""
    report = db.query(Report).filter(
        Report.file_id == file_id,
        Report.username == current_user.username
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Validation report not found"
        )
    
    db.delete(report)
    db.commit()
    
    return APIResponse(
        status="success",
        message="Validation report deleted successfully",
        data={}
    )


@router.post("/", response_model=APIResponse[ReportResponse]) # Added type safety
async def xml_upload(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith('.xml'):
        raise HTTPException(status_code=400, detail="Only XML files allowed")

    try:
        start_time = time.time()
        
        xml_bytes = await file.read()
        is_valid, error = validate_xml_all_errors(xml_bytes)
        
        execution_time = time.time() - start_time

        new_report = Report(
            file_name=file.filename,
            is_valid=is_valid,
            error_msg=error if not is_valid else 'None',
            validated_date=datetime.now(),
            file_type="XML",
            username=current_user.username,
            execution_time=execution_time
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        return APIResponse(
            status="SUCCESS" if is_valid else "Failed",
            message="Valid XML File" if is_valid else "Invalid XML File",
            data=new_report
        )
      
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/url",response_model=APIResponse[ReportResponse])
async def xml_url_check(
    data: URLUpload, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)  # Forces JWT Requirement
):
    # 1. Validation (Schema already checked if it's a string, we check format)
    if not url_validation(data.url):
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    try:
        start_time = time.time()
        
        # 2. Process via Service
        is_valid, error = validate_xml_from_url(data.url)
        
        execution_time = time.time() - start_time

        # 3. Save to Database
        new_report = Report(
            file_name=data.url,
            is_valid=is_valid,
            error_msg=error if not is_valid else "None",
            validated_date=datetime.now(),
            file_type="URL/XML",
            username=current_user.username,
            execution_time=execution_time
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        # 4. Standardized Response
        return APIResponse(
            status="SUCCESS" if is_valid else "Failed",
            message="Valid XML File" if is_valid else "Invalid XML File",
            data=new_report
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@router.post("/validate-path", response_model=APIResponse[ReportResponse])
async def validate_xml_from_path(
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Validate XML from a local file path (e.g., C:/Users/lavanyat/Desktop/xml/employee.xml)"""
    try:
        start_time = time.time()
        
        file_path = body.get('file_path') or body.get('filePath')
        
        if not file_path:
            raise HTTPException(status_code=400, detail="file_path parameter is required")
        
        from pathlib import Path
        
        # Normalize path and check if file exists
        normalized_path = Path(file_path).resolve()
        
        if not normalized_path.exists():
            raise HTTPException(status_code=400, detail=f"File not found: {file_path}")
        
        if not str(normalized_path).lower().endswith('.xml'):
            raise HTTPException(status_code=400, detail="File must be an XML file")
        
        # Read file
        with open(normalized_path, 'rb') as f:
            xml_bytes = f.read()
        
        is_valid, error = validate_xml_all_errors(xml_bytes)
        
        execution_time = time.time() - start_time
        
        new_report = Report(
            file_name=str(normalized_path),
            is_valid=is_valid,
            error_msg=error if not is_valid else 'None',
            validated_date=datetime.now(),
            file_type="LOCAL_PATH",
            username=current_user.username,
            execution_time=execution_time
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        return APIResponse(
            status="SUCCESS" if is_valid else "Failed",
            message="Valid XML File" if is_valid else "Invalid XML File",
            data=new_report
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error validating file: {str(e)}")


@router.get("/stats", response_model=APIResponse[Dict[str, Any]])
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        now = datetime.now()
        today_date = now.date()
        thirty_days_ago = today_date - timedelta(days=30)
    
        # 1. Main Stats
        # FIX: Removed [] around the condition
        stats = db.query(
            func.count(Report.file_id).label('total'),
            func.sum(case((Report.is_valid == True, 1), else_=0)).label('successful'),
        ).filter(
            Report.validated_date >= thirty_days_ago,
            Report.username == current_user.username 
        ).first()

        total = getattr(stats, 'total', 0) or 0
        successful = int(getattr(stats, 'successful', 0) or 0)
        failed = total - successful

        # 2. Get DB Daily Stats
        seven_days_ago = today_date - timedelta(days=6)
        daily_results = db.query(
            func.date(Report.validated_date).label('date_label'),
            func.count(Report.file_id).label('total'),
            # FIX: Removed [] around the condition
            func.sum(case((Report.is_valid == True, 1), else_=0)).label('successful')
        ).filter(
            Report.validated_date >= seven_days_ago,
            Report.username == current_user.username
        ).group_by(func.date(Report.validated_date)).all()

        db_stats_map = {str(r.date_label).split(' ')[0]: r for r in daily_results}

        # 3. Build the final 7-day list
        last_7_days = []
        for i in range(7):
            current_date = seven_days_ago + timedelta(days=i)
            date_str = current_date.isoformat() 
            day_name = current_date.strftime('%a')

            if date_str in db_stats_map:
                row = db_stats_map[date_str]
                r_total = getattr(row, 'total', 0) or 0
                r_success = int(getattr(row, 'successful', 0) or 0)
                last_7_days.append({
                    "day": day_name,
                    "total": r_total,
                    "successful": r_success,
                    "failed": r_total - r_success
                })
            else:
                last_7_days.append({
                    "day": day_name, "total": 0, "successful": 0, "failed": 0 
                })

        report_data = {
            "totalValidations": total,
            "successful": successful,
            "failed": failed,
            "avgTimeMs": 743, 
            "last7Days": last_7_days,
            "period": {
                "month": now.strftime("%B %Y"),
                "weekRange": f"{seven_days_ago.strftime('%b %d')}–{today_date.strftime('%b %d')}"
            },
        }

        return APIResponse(
            status="success",
            message="Statistics retrieved successfully",
            data=report_data
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")