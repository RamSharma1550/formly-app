import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
import app.models  # Register models with Base
from app.routes import forms_router, questions_router, public_forms_router, responses_router

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Formly API",
    description="Full-stack Typeform clone backend with FastAPI, SQLAlchemy, and SQLite.",
    version="1.0.0"
)

# Configure CORS — reads from env var CORS_ORIGINS for production
# In production, set CORS_ORIGINS=https://your-app.vercel.app in Railway env vars
cors_origins_env = os.getenv("CORS_ORIGINS", "*")

if cors_origins_env == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=cors_origins_env != "*",  # credentials only with specific origins
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forms_router)
app.include_router(questions_router)
app.include_router(public_forms_router)
app.include_router(responses_router)


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "Formly API", "environment": os.getenv("ENVIRONMENT", "development")}
