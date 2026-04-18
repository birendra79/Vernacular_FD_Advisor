from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
from utils.llm import init_llm

app = FastAPI(title="Vernacular FD Advisor API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.on_event("startup")
def startup_event():
    init_llm()

@app.get("/")
def read_root():
    return {"message": "Welcome to Vernacular FD Advisor API"}
