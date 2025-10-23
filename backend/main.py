#!/usr/bin/env python3
"""Entry point for the Internship Recommender backend"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "backend:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
