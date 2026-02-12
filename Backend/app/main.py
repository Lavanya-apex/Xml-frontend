from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.core.config import settings
from app.api.router import api_router
from app.database import engine, Base

# Create tables on startup
Base.metadata.create_all(bind=engine)

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        redirect_slashes=False
    )

    # 1. Set all CORS enabled origins
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # 2. Register all routers
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # 3. Custom OpenAPI Schema for Manual JWT Header
    def custom_openapi():
        # Cache the schema so it doesn't regenerate every time
        if app.openapi_schema:
            return app.openapi_schema
        
        openapi_schema = get_openapi(
            title="Professional XML Backend API",
            version="1.0.0",
            description="API using JSON-based authentication. Use the login endpoint to get a token, then paste it in the Authorize box.",
            routes=app.routes,
        )

        # Define the Security Scheme (Bearer Token)
        openapi_schema["components"]["securitySchemes"] = {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
            }
        }

        # Apply security requirements to routes that use the dependency
        # This adds the lock icon specifically to protected endpoints
        for path in openapi_schema["paths"]:
            for method in openapi_schema["paths"][path]:
                # We apply it to all except login and register
                if not any(excluded in path for excluded in ["login", "register"]):
                    openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]

        app.openapi_schema = openapi_schema
        return app.openapi_schema

    # Override the default openapi method
    app.openapi = custom_openapi

    return app

app = create_app()