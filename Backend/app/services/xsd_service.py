import io
import json
import yaml
import xmltodict
from lxml import etree
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException

from app.models.xsd import XSD

class XSDService:
    @staticmethod
    def validate_xsd_syntax(xsd_content: str):
        """Helper to ensure the XSD itself is valid."""
        try:
            schema_root = etree.XML(xsd_content.encode('utf-8'))
            etree.XMLSchema(schema_root)
        except Exception as e:
            raise ValueError(f"XSD Syntax Error: {str(e)}")

    @staticmethod
    def convert_to_xml(content: str, input_format: str) -> str:
        """Convert JSON or YAML to XML format."""
        if input_format.lower() == 'xml':
            return content
        
        try:
            if input_format.lower() == 'json':
                data = json.loads(content)
                # Wrap in a root element if it's not already
                if isinstance(data, dict):
                    xml_content = xmltodict.unparse({'root': data})
                else:
                    xml_content = xmltodict.unparse({'root': {'item': data}})
                return xml_content
            
            elif input_format.lower() == 'yaml':
                data = yaml.safe_load(content)
                if isinstance(data, dict):
                    xml_content = xmltodict.unparse({'root': data})
                else:
                    xml_content = xmltodict.unparse({'root': {'item': data}})
                return xml_content
            
            else:
                raise ValueError(f"Unsupported input format: {input_format}")
        
        except Exception as e:
            raise ValueError(f"Format conversion error ({input_format}→XML): {str(e)}")

    @staticmethod
    def convert_from_xml(xml_content: str, output_format: str) -> str:
        """Convert XML to JSON or YAML format."""
        if output_format.lower() == 'xml':
            return xml_content
        
        try:
            # Parse XML to dict
            data = xmltodict.parse(xml_content)
            
            if output_format.lower() == 'json':
                return json.dumps(data, indent=2)
            
            elif output_format.lower() == 'yaml':
                return yaml.dump(data, default_flow_style=False, sort_keys=False)
            
            else:
                raise ValueError(f"Unsupported output format: {output_format}")
        
        except Exception as e:
            raise ValueError(f"Format conversion error (XML→{output_format}): {str(e)}")


    @staticmethod
    async def get_xsd_content(
        db: Session, 
        username: str, 
        xsd_id: Optional[int] = None, 
        new_xsd_file: Optional[UploadFile] = None
    ) -> str:
        """Determines where the XSD content comes from."""
        if xsd_id:
            db_xsd = db.query(XSD).filter(XSD.xsd_id == xsd_id, XSD.username == username).first()
            if not db_xsd:
                raise HTTPException(status_code=404, detail="Stored XSD not found.")
            return db_xsd.xsd_content
        
        if new_xsd_file:
            content = await new_xsd_file.read()
            return content.decode("utf-8")
        
        raise HTTPException(status_code=400, detail="Provide an XSD ID or a new XSD file.")

    @staticmethod
    def save_new_xsd(db: Session, username: str, name: str, content: str) -> XSD:
        """Saves a new XSD to the database."""
        try:
            XSDService.validate_xsd_syntax(content)
            new_entry = XSD(xsd_name=name, xsd_content=content, username=username)
            db.add(new_entry)
            db.commit()
            db.refresh(new_entry)
            return new_entry
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Failed to save XSD: {str(e)}")

    @staticmethod
    async def validate_xml_logic(xsd_content: str, xml_file: UploadFile, input_format: str = 'xml', output_format: str = 'xml') -> Dict[str, Any]:
        """Core logic to validate XML against XSD content with format conversion support."""
        try:
            # Read the input file
            xml_data = await xml_file.read()
            input_content = xml_data.decode("utf-8")
            
            # Convert input format to XML if needed
            xml_to_validate = XSDService.convert_to_xml(input_content, input_format)
            
            # Prepare Schema
            schema_root = etree.XML(xsd_content.encode('utf-8'))
            schema = etree.XMLSchema(schema_root)
            
            # Parse and validate XML
            xml_doc = etree.parse(io.BytesIO(xml_to_validate.encode('utf-8')))
            
            # Validate
            schema.assertValid(xml_doc)
            
            # Convert output format if needed
            output_content = XSDService.convert_from_xml(xml_to_validate, output_format)
            
            return {
                "valid": True, 
                "errors": [],
                "input_format": input_format,
                "output_format": output_format,
                "validated_content": output_content
            }

        except etree.DocumentInvalid as e:
            return {
                "valid": False, 
                "errors": [{"line": err.line if hasattr(err, 'line') else None, "msg": str(err.message) if hasattr(err, 'message') else str(err)} for err in e.error_log],
                "input_format": input_format,
                "output_format": output_format
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")