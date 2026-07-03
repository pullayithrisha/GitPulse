from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import time
import json
import asyncio
import os
from typing import Optional

# Load .env file before importing github_api so GITHUB_TOKEN is in environ
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from github_api import stream_all_repo_data, format_sse
from analytics import calculate_analytics
from recommendations import generate_recommendations

app = FastAPI(title="GitPulse API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache: username -> (timestamp, data)
# Expires after 15 minutes (900 seconds)
cache = {}
CACHE_EXPIRY = 900


@app.get("/api/analyze/{username}")
async def analyze_user(username: str):
    """Analyze a GitHub user's profile. Token is handled server-side."""

    async def sse_generator():
        current_time = time.time()

        # Check cache
        if username in cache:
            cache_time, cached_data = cache[username]
            if current_time - cache_time < CACHE_EXPIRY:
                yield format_sse("progress", "Loaded from cache...")
                yield format_sse("complete", cached_data)
                return

        # Stream from GitHub
        async for chunk in stream_all_repo_data(username):
            try:
                event = json.loads(chunk.replace("data: ", "", 1).strip())
                if event["type"] == "complete":
                    data = event["data"]

                    yield format_sse("progress", "Calculating analytics and scoring...")

                    analytics_result = calculate_analytics(data)
                    recommendations = generate_recommendations(analytics_result)

                    response_data = {
                        "profile": data["profile"],
                        "analytics": analytics_result,
                        "recommendations": recommendations,
                    }

                    # Save to cache
                    cache[username] = (current_time, response_data)

                    yield format_sse("complete", response_data)
                else:
                    yield chunk
            except Exception:
                yield chunk

    return StreamingResponse(sse_generator(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
