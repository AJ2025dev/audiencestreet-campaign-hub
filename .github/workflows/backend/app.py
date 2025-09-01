# backend/app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import pmp, campaigns, creatives, admin, integrations

app = FastAPI(title="Campaign Hub API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Simple health probe
@app.get("/health")
def health():
    return {"ok": True}

app.include_router(pmp.router, prefix="/api/pmp", tags=["PMP"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["Campaigns"])
app.include_router(creatives.router, prefix="/api/creatives", tags=["Creatives"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["Integrations"])
