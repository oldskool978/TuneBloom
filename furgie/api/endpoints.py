import json
import tempfile
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import Response
import numpy as np
import soundfile as sf
import torch

from .schemas import (
    ArrayProcessRequest,
    ArrayProcessResponse,
    FurgieInferenceConfig,
    StatusResponse,
)

router = APIRouter()

@router.get("/models/status", response_model=StatusResponse)
async def get_status(request: Request) -> StatusResponse:
    engine = request.app.state.engine
    return StatusResponse(
        status="ready" if engine.wrapper._is_loaded else "uninitialized",
        cuda_available=torch.cuda.is_available(),
        device=str(engine.device),
        active_model=engine.current_model_repo,
    )

@router.post("/process/file")
async def process_file(
    request: Request,
    file: UploadFile = File(...),
    config: Optional[str] = Form(None),
) -> Response:
    engine = request.app.state.engine
    cfg = FurgieInferenceConfig(**json.loads(config)) if config else FurgieInferenceConfig()

    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename or "input.wav").suffix) as in_tmp, \
         tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as out_tmp:
        in_bytes = await file.read()
        in_tmp.write(in_bytes)
        in_tmp_path = Path(in_tmp.name)
        out_tmp_path = Path(out_tmp.name)

    try:
        engine.synthesize(
            audio_path=in_tmp_path,
            output_path=out_tmp_path,
            ode_steps=cfg.ode_steps,
            solver=cfg.solver,
            guidance_scale=cfg.guidance_scale,
            input_sr_anchor=cfg.input_sr_anchor,
            headroom_mode=cfg.headroom_mode,
            target_peak_dbfs=cfg.target_peak_dbfs,
            target_rate=cfg.target_rate,
        )
        with open(out_tmp_path, "rb") as f:
            out_bytes = f.read()

        base_name = Path(file.filename or "audio.wav").stem
        suffix_rate = "44k1" if cfg.target_rate == "44.1k" else "48k"
        return Response(
            content=out_bytes,
            media_type="audio/wav",
            headers={"Content-Disposition": f'attachment; filename="{base_name}_furgie_{suffix_rate}.wav"'},
        )
    finally:
        in_tmp_path.unlink(missing_ok=True)
        out_tmp_path.unlink(missing_ok=True)

@router.post("/process/array", response_model=ArrayProcessResponse)
async def process_array(
    request: Request, payload: ArrayProcessRequest
) -> ArrayProcessResponse:
    engine = request.app.state.engine
    cfg = payload.config or FurgieInferenceConfig()

    audio_np = np.array(payload.audio, dtype=np.float32)
    if audio_np.size == 0:
        raise HTTPException(status_code=400, detail="Input audio array is empty.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as in_tmp, \
         tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as out_tmp:
        in_data = audio_np.T if audio_np.ndim > 1 else audio_np
        sf.write(in_tmp.name, in_data, payload.sample_rate, subtype="FLOAT")
        in_tmp_path = Path(in_tmp.name)
        out_tmp_path = Path(out_tmp.name)

    try:
        res = engine.synthesize(
            audio_path=in_tmp_path,
            output_path=out_tmp_path,
            ode_steps=cfg.ode_steps,
            solver=cfg.solver,
            guidance_scale=cfg.guidance_scale,
            input_sr_anchor=cfg.input_sr_anchor,
            headroom_mode=cfg.headroom_mode,
            target_peak_dbfs=cfg.target_peak_dbfs,
            target_rate=cfg.target_rate,
        )
        restored_np, sr = sf.read(str(out_tmp_path), dtype="float32")
        out_list = restored_np.T.tolist() if restored_np.ndim > 1 else [restored_np.tolist()]
        return ArrayProcessResponse(
            audio=out_list,
            sample_rate=sr,
            duration_sec=res["duration_sec"],
            peak_vram_gb=res["peak_vram_gb"],
            peak_dbfs=res["peak_dbfs"],
            true_peak_dbtp=res["true_peak_dbtp"],
            master_gain_scalar=res["master_gain_scalar"],
        )
    finally:
        in_tmp_path.unlink(missing_ok=True)
        out_tmp_path.unlink(missing_ok=True)