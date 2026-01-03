"""
QuizzMe Cloud Engine - Main Entry Point

FastAPI application for handling computational tasks.
"""

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="QuizzMe Cloud Engine",
    description="Python microservice for computational tasks",
    version="0.1.0",
)


class HealthResponse(BaseModel):
    status: str
    version: str


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="healthy", version="0.1.0")


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint."""
    return {"message": "QuizzMe Cloud Engine"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
