from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import VerifiedLabValuesRequest
from app.services.lab_analysis import analyze_lab_value

MAX_FILE_SIZE_IN_MB = 10
MAX_FILE_SIZE_IN_BYTES = MAX_FILE_SIZE_IN_MB * 1024 * 1024

ALLOWED_FILE_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
}


app = FastAPI(
    title="LabLens API",
    version="0.1.0",
)

# React development server ko backend API call karne ki permission deta hai.
# Production mein is list ko exact deployed frontend URL tak restrict karenge.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    """Confirms that the backend server is running."""
    return {"status": "ok"}


def validate_report_file(report: UploadFile) -> None:
    """
    Checks basic file metadata before processing an uploaded lab report.

    Backend validation is necessary because browser-side validation
    alone cannot be trusted for security.
    """
    if report.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF, PNG, and JPG files are allowed.",
        )


async def get_file_size(report: UploadFile) -> int:
    """
    Reads the file in small chunks and rejects it once it exceeds the limit.

    Chunked reading avoids loading an entire potentially large file into memory.
    """
    total_size = 0
    chunk_size = 1024 * 1024  # Read 1 MB at a time.

    while chunk := await report.read(chunk_size):
        total_size += len(chunk)

        if total_size > MAX_FILE_SIZE_IN_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File must be smaller than {MAX_FILE_SIZE_IN_MB} MB.",
            )

    return total_size


@app.post("/api/reports/upload")
async def upload_report(
    report: UploadFile = File(...),
) -> dict[str, str | int]:
    """
    Validates one lab report upload.

    OCR, encrypted storage, and database records will be added in later steps.
    """
    validate_report_file(report)
    file_size = await get_file_size(report)

    return {
        "message": "Report received and validated.",
        "file_name": report.filename or "unnamed-report",
        "content_type": report.content_type or "unknown",
        "size_bytes": file_size,
    }
    
@app.post("/api/lab-values/verify")
def verify_lab_values(
    payload: VerifiedLabValuesRequest,
) -> dict[str, object]:
    """
    Validates user-reviewed lab values.

    This endpoint does not diagnose or analyze results yet.
    It prepares trusted structured data for the next analysis step.
    """
    return {
        "message": "Verified lab values received.",
        "total_values": len(payload.values),
        "values": [
            lab_value.model_dump(by_alias=True)
            for lab_value in payload.values
        ],
    }
    
@app.post("/api/lab-values/analyze")
def analyze_verified_lab_values(
    payload: VerifiedLabValuesRequest,
) -> dict[str, object]:
    """
    Classifies verified lab values against their supplied reference ranges.

    This endpoint provides educational range status only.
    It does not diagnose conditions or recommend treatment.
    """
    analyzed_values = [
        analyze_lab_value(lab_value)
        for lab_value in payload.values
    ]

    return {
        "message": "Lab values classified using supplied reference ranges.",
        "results": [
            analyzed_value.model_dump(by_alias=True)
            for analyzed_value in analyzed_values
        ],
        "safety_notice": (
            "Educational information only. A result outside a reference range "
            "does not identify a cause or diagnosis. Discuss concerning results "
            "or symptoms with a qualified healthcare professional."
        ),
    }