from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine

# Ensure tables are created on startup if using direct database initialization
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f'{settings.API_V1_STR}/openapi.json',
    docs_url='/docs',
    redoc_url='/redoc'
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'] if '*' in settings.CORS_ORIGINS else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/health', tags=['Health'])
def health_check():
    return {'status': 'healthy', 'service': settings.PROJECT_NAME}
