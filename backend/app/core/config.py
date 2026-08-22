from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = 'Apex Motors Car Dealership Inventory API'
    API_V1_STR: str = '/api'
    DATABASE_URL: str = 'sqlite:///./dealership.db'
    JWT_SECRET: str = 'incubyte-dealership-super-secure-jwt-secret-key-2026'
    JWT_ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: Union[List[str], str] = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000', '*']

    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith('['):
            return [i.strip() for i in v.split(',')]
        elif isinstance(v, str) and v.startswith('['):
            import json
            return json.loads(v)
        return v

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

settings = Settings()
