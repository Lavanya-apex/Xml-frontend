from fastapi import APIRouter
from app.api.xml import users, xmlReport,agent_route,xsd_router

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(xsd_router.router, prefix="/xsd", tags=["XSD"])
api_router.include_router(xmlReport.router, prefix="/validate", tags=["xml"])
api_router.include_router(agent_route.router, prefix="/Agent", tags=["agent"])