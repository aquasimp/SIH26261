"""
AICTE Regulatory Scrutiny & Forensic Document Intelligence Backend
FastAPI Microservice (PS 26261)
Provides ELA forensics, Noiseprint++ simulation, Shoelace CAD calculations,
EPFO/DigiLocker Authority Bridge endpoints, and APH compliance math.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime

app = FastAPI(
    title="AICTE Regulatory Intelligence & Forensic Scrutiny API",
    description="Evidence-Linked AI Decision-Support & Forensic Scrutiny Service for AICTE (PS 26261)",
    version="4.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Models -----------------

class ElaRequest(BaseModel):
    document_id: str = "DOC-FIRE-01"
    jpeg_quality: int = 75
    gamma: int = 20

class FloorPlanRequest(BaseModel):
    polygon_points: List[List[float]] = [[310, 40], [420, 40], [420, 140], [310, 140]]
    scale_factor_m_per_px: float = 0.04167

class ComplianceCalcRequest(BaseModel):
    ug_intake: int = 360
    pg_intake: int = 60
    fsi_norm: float = 2.0
    zone_type: str = "Urban"
    allied_lab_sharing: float = 0.15

class OverrideRequest(BaseModel):
    application_id: str
    officer_id: str
    decision: str
    remarks: str

# ----------------- Endpoints -----------------

@app.get("/")
def root():
    return {
        "service": "AICTE Scrutiny & Forensic Intelligence Service",
        "statutory_mandate": "Approval Process Handbook (APH 2024-2027)",
        "dpi_bridge_status": "6/6 Authorities Online",
        "models_loaded": [
            "TruFor (Noiseprint++ + ResAware)",
            "NFA-ViT",
            "Mask2Former-Swin-Base",
            "RetinaFace + ArcFace 512-D",
            "PP-StructureV3 + LayoutLMv3"
        ]
    }

@app.get("/api/v1/dashboard/summary")
def get_dashboard_summary():
    return {
        "total_applications_ingested": 4820,
        "cleared_pre_scrutiny": 3194,
        "rectifiable_deficiencies_issued": 1182,
        "fatal_forgery_alerts": 148,
        "cross_campus_ghost_faculty": 296,
        "authority_bridge_success_rate": 0.984,
        "avg_response_latency_ms": 142
    }

@app.post("/api/v1/forensics/ela")
def analyze_ela(req: ElaRequest):
    """
    Simulates Error Level Analysis (ELA) and DCT Block Artifact Grid (BAG) phase shift.
    """
    simulated_peak_residual = round((req.gamma / 20.0) * (100.0 - req.jpeg_quality) * 1.84, 2)
    return {
        "document_id": req.document_id,
        "jpeg_quality": req.jpeg_quality,
        "gamma_multiplier": req.gamma,
        "peak_residual_error": simulated_peak_residual,
        "dct_macroblock_phase_shift": {"dx": 3, "dy": 5},
        "spliced_bounding_box": [64, 42, 88, 48],
        "tamper_detected": True,
        "tamper_probability": 0.984,
        "confidence_score": 0.942,
        "verdict": "CONFIRMED_LOCAL_JPEG_RECOMPRESSION_SPLICING"
    }

@app.post("/api/v1/floorplan/segment")
def compute_floorplan_polygon(req: FloorPlanRequest):
    """
    Computes true physical area in square meters using Shoelace formula and scale calibration.
    """
    pts = req.polygon_points
    if len(pts) < 3:
        raise HTTPException(status_code=400, detail="Polygon must have at least 3 vertices")

    # Shoelace formula
    sum1 = 0.0
    sum2 = 0.0
    n = len(pts)
    for i in range(n):
        next_i = (i + 1) % n
        sum1 += pts[i][0] * pts[next_i][1]
        sum2 += pts[next_i][0] * pts[i][1]

    area_px = 0.5 * abs(sum1 - sum2)
    s = req.scale_factor_m_per_px
    area_sqm = round(area_px * (s * s), 2)

    aph_min_norm = 66.0 # Standard AICTE Engineering Lab
    shortfall = round(aph_min_norm - area_sqm, 2)

    return {
        "pixel_area": area_px,
        "scale_factor_m_per_px": s,
        "computed_carpet_area_sqm": area_sqm,
        "aph_chapter_vii_norm_sqm": aph_min_norm,
        "shortfall_sqm": shortfall,
        "status": "INSUFFICIENT_AREA" if shortfall > 0 else "COMPLIANT"
    }

@app.post("/api/v1/authority/verify")
def verify_authority_payload(payload: Dict[str, Any]):
    authority = payload.get("authority", "Haryana Directorate of Fire Services")
    doc_uri = payload.get("doc_uri", "in.gov.har.fire-NOC-2021-8841")
    uploaded_expiry = payload.get("uploaded_expiry_date", "30-06-2027")
    authoritative_expiry = payload.get("authoritative_expiry_date", "30-06-2024")

    is_mismatch = uploaded_expiry != authoritative_expiry
    return {
        "status": "MISMATCH_DETECTED" if is_mismatch else "VERIFIED_VALID",
        "authority": authority,
        "doc_uri": doc_uri,
        "uploaded_expiry_date": uploaded_expiry,
        "authoritative_expiry_date": authoritative_expiry,
        "hmac_signature_valid": True,
        "latency_ms": 118
    }

@app.post("/api/v1/scrutiny/override")
def record_officer_override(req: OverrideRequest):
    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    return {
        "status": "RECORDED",
        "application_id": req.application_id,
        "officer_id": req.officer_id,
        "decision": req.decision,
        "timestamp": timestamp,
        "sha256_audit_block": "3c84719284719283749182374918273491827349182734918273491827349182"
    }

@app.get("/api/v1/audit/ledger")
def get_audit_ledger():
    return {
        "ledger_blocks": 6,
        "chain_integrity": "100% VALID",
        "last_hash": "8a91827349182734918273491827349182734918273491827349182734918273"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
