from contextlib import asynccontextmanager
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch
from furgie_core.engine import FurgieEngine
from .endpoints import router

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = PROJECT_ROOT / "furgie_core" / "config" / "inference" / "Furgie_Convergent_48k.yaml"


@asynccontextmanager
async def lifespan(app: FastAPI):
    device = os.getenv("FURGIE_DEVICE", "cuda" if torch.cuda.is_available() else "cpu")
    config_path = os.getenv("FURGIE_CONFIG", str(DEFAULT_CONFIG))
    app.state.engine = FurgieEngine(config_path=config_path, device=device)
    yield
    app.state.engine = None


app = FastAPI(
    title="Furgie Complex STFT Generative Super-Resolution Service",
    description="REST Microservice for 48 kHz Filterless Complex STFT Flow Matching Super-Resolution.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/v1")