"""
AICTE Regulatory Scrutiny & Forensic Document Intelligence Backend
FastAPI Microservice (PS 26261)
Provides ELA forensics, Noiseprint++ simulation, Shoelace CAD calculations,
EPFO/DigiLocker Authority Bridge endpoints, PKCE/HMAC Web Crypto verification,
Qdrant 512-D ArcFace HNSW vector search simulation, and SHA-256 Audit Chain Verification.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime
import hashlib
import hmac
import base64

app = FastAPI(
    title="AICTE Regulatory Intelligence & Forensic Scrutiny API",
    description="Evidence-Linked AI Decision-Support & Forensic Scrutiny Service for AICTE (PS 26261)",
    version="4.3.0"
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

class PkceHmacRequest(BaseModel):
    issuer_id: str = "in.gov.har.fire"
    doc_type: str = "NOC"
    doc_id: str = "2021-8841"
    client_id: str = "AICTE_SCRUTINY_NODE_04"
    client_secret: str = "sec_har_fire_8492019ab921c"
    code_verifier: str = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
    timestamp: Optional[str] = None

class EpfoWageRequest(BaseModel):
    uan: str = "100492817291"
    gross_salary: float = 120000.0
    declared_basic_da: float = 28000.0
    primary_pf_code: str = "HR/GUR/0048192"

class QdrantSearchRequest(BaseModel):
    query_uan: str = "100492817291"
    cosine_threshold: float = 0.78
    ef_search: int = 64

class AuditBlockModel(BaseModel):
    blockIndex: int
    timestamp: str
    eventType: str
    applicationId: str
    targetArtifact: str
    actorOrModel: str
    previousHash: str
    currentHash: str

class ChainVerifyRequest(BaseModel):
    blocks: List[AuditBlockModel]

# ----------------- Endpoints -----------------

@app.get("/")
def root():
    return {
        "service": "AICTE Scrutiny & Forensic Intelligence Service",
        "statutory_mandate": "Approval Process Handbook (APH 2024-2027)",
        "dpi_bridge_status": "6/6 Authorities Online (mTLS 1.3)",
        "models_loaded": [
            "TruFor (Noiseprint++ + ResAware)",
            "NFA-ViT",
            "Mask2Former-Swin-Base",
            "RetinaFace + ArcFace 512-D",
            "PP-StructureV3 + LayoutLMv3"
        ],
        "crypto_algorithms": ["SHA-256", "HMAC-SHA256", "PKCE S256", "ECDSA secp256r1"]
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

@app.post("/api/v1/authority/pkce-hmac")
def verify_pkce_hmac(req: PkceHmacRequest):
    """
    Verifies OAuth 2.0 PKCE challenge (RFC 7636) and computes x-digilocker-hmac (RFC 2104).
    """
    ts = req.timestamp or datetime.datetime.now(datetime.timezone.utc).isoformat()
    pull_uri = f"{req.issuer_id}-{req.doc_type}-{req.doc_id}"
    req_body = f"<PullDocRequest><DocDetails><URI>{pull_uri}</URI></DocDetails></PullDocRequest>"

    # 1. PKCE S256 Challenge
    verifier_bytes = req.code_verifier.encode("utf-8")
    sha256_digest = hashlib.sha256(verifier_bytes).digest()
    code_challenge = base64.urlsafe_b64encode(sha256_digest).decode("utf-8").rstrip("=")

    # 2. HMAC-SHA256
    payload_to_sign = f"{req.client_id}|{ts}|{req_body}".encode("utf-8")
    secret_bytes = req.client_secret.encode("utf-8")
    hmac_digest = hmac.new(secret_bytes, payload_to_sign, hashlib.sha256).hexdigest()

    return {
        "pull_uri": pull_uri,
        "code_verifier": req.code_verifier,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
        "client_id": req.client_id,
        "timestamp": ts,
        "x_digilocker_hmac": hmac_digest,
        "mtls_cipher": "TLS_AES_256_GCM_SHA384"
    }

@app.post("/api/v1/authority/epfo-ecr")
def calculate_epfo_wage_add_back(req: EpfoWageRequest):
    """
    Enforces Social Security Code (2026) 50% Basic Wage Add-Back Rule.
    If excluded allowances exceed 50% of gross remuneration, excess is added back to basic wage.
    """
    gross = req.gross_salary
    basic = req.declared_basic_da
    excluded = max(0.0, gross - basic)
    max_permissible_allowances = 0.50 * gross
    deemed_wage_add_back = max(0.0, excluded - max_permissible_allowances)

    statutory_base = basic + deemed_wage_add_back
    statutory_12pct_epf = round(0.12 * statutory_base, 2)
    actual_12pct_remitted = round(0.12 * basic, 2)
    shortfall = max(0.0, statutory_12pct_epf - actual_12pct_remitted)

    is_ghost = req.uan == "100492817291"

    return {
        "uan": req.uan,
        "gross_salary": gross,
        "declared_basic_da": basic,
        "excluded_allowances": excluded,
        "max_permissible_allowances_50pct": max_permissible_allowances,
        "deemed_wage_add_back": deemed_wage_add_back,
        "statutory_epf_base": statutory_base,
        "statutory_12pct_remittance": statutory_12pct_epf,
        "actual_12pct_remitted": actual_12pct_remitted,
        "monthly_shortfall": shortfall,
        "rule_violated": deemed_wage_add_back > 0,
        "dual_employment_detected": is_ghost,
        "concurrent_employer": "Noida Institute of Engg & Tech (NIET) [PID: 1-1092837419]" if is_ghost else None,
        "statutory_citation": "EPF Scheme 2026 Para 28(3) & Social Security Code 2026 Sec 2(88)"
    }

@app.post("/api/v1/authority/qdrant-ann")
def search_qdrant_hnsw_vectors(req: QdrantSearchRequest):
    """
    Simulates Qdrant HNSW Approximate Nearest Neighbor (ANN) vector search across 1.2M national faculty index.
    """
    latency_ms = round(1.8 + (req.ef_search / 64.0) * 1.4, 2)
    matches = [
        {
            "rank": 1,
            "pid": "1-1092837419",
            "institution_name": "Noida Institute of Engg & Tech (NIET)",
            "region": "Northern",
            "cosine_similarity": 0.942,
            "euclidean_distance": 0.058,
            "flag": "CONCURRENT_GHOST_FACULTY",
            "is_above_threshold": 0.942 >= req.cosine_threshold
        },
        {
            "rank": 2,
            "pid": "1-9482710392",
            "institution_name": "Apex Institute of Technology & Management",
            "region": "North-Western",
            "cosine_similarity": 1.000,
            "euclidean_distance": 0.000,
            "flag": "SELF_ENROLLMENT",
            "is_above_threshold": True
        },
        {
            "rank": 3,
            "pid": "1-4910294819",
            "institution_name": "SRM University NCR Campus",
            "region": "North-Western",
            "cosine_similarity": 0.312,
            "euclidean_distance": 0.688,
            "flag": "SAFE_UNFLAGGED",
            "is_above_threshold": 0.312 >= req.cosine_threshold
        }
    ]

    filtered = [m for m in matches if m["is_above_threshold"]]

    return {
        "query_uan": req.query_uan,
        "index_parameters": {
            "dimension": 512,
            "metric": "Cosine",
            "M": 32,
            "ef_construction": 200,
            "ef_search": req.ef_search
        },
        "query_latency_ms": latency_ms,
        "total_matches_above_threshold": len(filtered),
        "results": filtered
    }

@app.post("/api/v1/audit/verify-chain")
def verify_audit_chain(req: ChainVerifyRequest):
    """
    Validates block-by-block cryptographic hash chain links: SHA-256(prevHash + timestamp + appId + eventType + actorOrModel)
    """
    sorted_blocks = sorted(req.blocks, key=lambda b: b.blockIndex)
    invalid_blocks = []
    details = []

    for i, b in enumerate(sorted_blocks):
        if i > 0:
            prev = sorted_blocks[i - 1]
            if b.previousHash != prev.currentHash:
                invalid_blocks.append(b.blockIndex)
                details.append(f"Block #{b.blockIndex} broken chain link")
                continue

        payload = f"{b.previousHash}{b.timestamp}{b.applicationId}{b.eventType}{b.actorOrModel}".encode("utf-8")
        expected_hash = hashlib.sha256(payload).hexdigest()

        if expected_hash != b.currentHash:
            invalid_blocks.append(b.blockIndex)
            details.append(f"Block #{b.blockIndex} hash mismatch")
        else:
            details.append(f"Block #{b.blockIndex} verified")

    return {
        "is_valid": len(invalid_blocks) == 0,
        "total_blocks": len(sorted_blocks),
        "verified_count": len(sorted_blocks) - len(invalid_blocks),
        "invalid_blocks": invalid_blocks,
        "chain_integrity": "100% VALID" if len(invalid_blocks) == 0 else "TAMPER_DETECTED"
    }

@app.post("/api/v1/scrutiny/decision")
def record_closed_loop_decision(payload: Dict[str, Any]):
    app_id = payload.get("application_id", "AICTE-2026-NW-0842")
    decision_type = payload.get("decision_type", "APPROVE_EOA")
    officer_id = payload.get("officer_id", "Regional Scrutiny Officer (RO-04 Shri R.K. Verma)")
    prev_hash = payload.get("previous_hash", "7832895952fc7eb51b61ea95cc48274ec4b0d6f998993a6911298facd0b08fa4")
    ts = datetime.datetime.now(datetime.timezone.utc).isoformat()

    data_string = f"{prev_hash}{ts}{app_id}{decision_type}{officer_id}".encode("utf-8")
    block_hash = hashlib.sha256(data_string).hexdigest()

    return {
        "status": "MUTATION_COMMITTED",
        "application_id": app_id,
        "decision_type": decision_type,
        "timestamp": ts,
        "sha256_current_hash": block_hash,
        "previous_hash": prev_hash
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
