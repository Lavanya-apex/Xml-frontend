
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.xsd import XSD
from app.schemas.users import UserCreate, UserLogin, PasswordUpdate
from app.schemas.responses import APIResponse
from app.core.security import Security,  get_current_user
from app.schemas.xsd import XSDResponse,XSDRequest
from typing import Dict, Any, List, Optional
import io
from lxml import etree
from app.services.xsd_service import XSDService
router = APIRouter()
def validate_xsd_syntax(xsd_string: str):
    try:
       
        xml_schema_doc = etree.parse(io.BytesIO(xsd_string.encode('utf-8')))
       
        etree.XMLSchema(xml_schema_doc)
    except Exception as e:
        
        raise ValueError(str(e))
@router.post("/upload", response_model=APIResponse[XSDResponse], status_code=status.HTTP_201_CREATED)
async def upload_XSD(
    xsd_name: str = Query(...), 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    # Read the file content
    content = await file.read()
    xsd_content_str = content.decode("utf-8")

    # 1. Professional Validation (Check if it's valid XML)
    try:
        validate_xsd_syntax(xsd_content_str)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid XSD file: {str(e)}")

    # 2. Save to Database
    try:
        new_xsd = XSD(
            xsd_name=xsd_name,
            xsd_content=xsd_content_str,
            username=current_user.username
        )
        db.add(new_xsd)
        db.commit()
        db.refresh(new_xsd)

        return APIResponse(status="success", message="File uploaded successfully", data=new_xsd)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/", response_model=APIResponse[list[XSDResponse]], status_code=status.HTTP_200_OK)
def get_all_xsd(
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    try:
        # Query the XSD table filtered by the logged-in user's username
        xsds = db.query(XSD).filter(XSD.username == current_user.username).all()

        return APIResponse(
            status="success",
            message=f"Retrieved {len(xsds)} XSD schemas",
            data=xsds
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch XSDs: {str(e)}"
        )
@router.post("/validate", response_model=APIResponse[Dict[str, Any]])
async def validate_xml(
    xsd_id: Optional[int] = Form(None),
    xsd_name: Optional[str] = Form(None),
    xml_file: UploadFile = File(...),
    new_xsd_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1. Get XSD Content (from DB or Upload)
    xsd_content = await XSDService.get_xsd_content(
        db, current_user.username, xsd_id, new_xsd_file
    )

    # 2. Optionally save it if it's new and has a name
    if not xsd_id and xsd_name:
        XSDService.save_new_xsd(db, current_user.username, xsd_name, xsd_content)

    # 3. Perform Validation
    result = await XSDService.validate_xml_logic(xsd_content, xml_file)

    if result["valid"]:
        return APIResponse(status="success", message="Validation Passed", data=result)
    
    return APIResponse(status="error", message="Validation Failed", data=result)
    

