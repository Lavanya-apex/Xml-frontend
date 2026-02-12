from typing import List # <--- This was the missing piece!
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field

class Settings(BaseSettings):
    # Core Settings
    SECRET_KEY: str = "your-secret-key-here"
    PROJECT_NAME: str = "FastAPI Professional Project"
    API_V1_STR: str = "/api/v1"
    
    # --- ADD THESE TWO LINES ---
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 
    # ---------------------------

    # Database Settings
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_NAME: str
    
    # ... rest of your code (computed_field, model_config, etc.)
    
    @computed_field
    @property
    def sqlalchemy_database_uri(self) -> str:
        return (
            f"mysql+mysqlconnector://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}/{self.DB_NAME}"
        )

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000","http://localhost:5173"]
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        case_sensitive=True, 
        extra="ignore"
    )

# Force Pydantic to finalize the model definition
Settings.model_rebuild()

settings = Settings()