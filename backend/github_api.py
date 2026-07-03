import httpx
import asyncio
import os
import logging
from typing import Dict, Any, List, Optional, AsyncGenerator
import json

# ---------------------------------------------------------------------------
# Load server-side token from environment (populated from .env by startup)
# ---------------------------------------------------------------------------
GITHUB_TOKEN: Optional[str] = os.environ.get("GITHUB_TOKEN") or None

if GITHUB_TOKEN:
    logging.info("GITHUB_TOKEN found — using authenticated GraphQL + REST mode.")
else:
    logging.warning(
        "GITHUB_TOKEN is not set. Falling back to unauthenticated REST-only mode "
        "(60 req/hr limit). Set GITHUB_TOKEN in backend/.env for full functionality."
    )

GITHUB_API_URL = "https://api.github.com"
GRAPHQL_URL = "https://api.github.com/graphql"


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------
class RateLimitException(Exception):
    def __init__(self, message="GitHub API rate limit exceeded."):
        self.message = message
        super().__init__(self.message)


class UserNotFoundException(Exception):
    pass


class UnauthorizedException(Exception):
    pass


# ---------------------------------------------------------------------------
# Headers
# ---------------------------------------------------------------------------
def get_headers(token: Optional[str] = None) -> Dict[str, str]:
    """Return request headers, using server-side token when available."""
    effective_token = token or GITHUB_TOKEN
    headers: Dict[str, str] = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if effective_token:
        headers["Authorization"] = f"Bearer {effective_token}"
    return headers


# ---------------------------------------------------------------------------
# Response guard
# ---------------------------------------------------------------------------
async def check_response(response: httpx.Response):
    if response.status_code == 404:
        raise UserNotFoundException("User not found")
    if response.status_code == 401:
        raise UnauthorizedException("Invalid or missing Personal Access Token")
    if response.status_code in (403, 429):
        if (
            "X-RateLimit-Remaining" in response.headers
            and response.headers["X-RateLimit-Remaining"] == "0"
        ):
            raise RateLimitException()
    response.raise_for_status()


# ---------------------------------------------------------------------------
# REST helpers
# ---------------------------------------------------------------------------
async def fetch_user_profile(client: httpx.AsyncClient, username: str) -> Dict[str, Any]:
    url = f"{GITHUB_API_URL}/users/{username}"
    response = await client.get(url, headers=get_headers())
    await check_response(response)
    return response.json()


async def check_repo_readme(
    client: httpx.AsyncClient, owner: str, repo: str
) -> bool:
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/readme"
    response = await client.get(url, headers=get_headers())
    if response.status_code == 200:
        return True
    if response.status_code in (403, 429):
        if (
            "X-RateLimit-Remaining" in response.headers
            and response.headers["X-RateLimit-Remaining"] == "0"
        ):
            raise RateLimitException()
    return False


def _parse_link_next(link_header: Optional[str]) -> Optional[str]:
    """Extract the rel='next' URL from a GitHub Link header, or None."""
    if not link_header:
        return None
    for part in link_header.split(","):
        segments = [s.strip() for s in part.split(";")]
        if len(segments) == 2 and segments[1] == 'rel="next"':
            url = segments[0].strip("<>")
            return url
    return None


async def fetch_all_repos(
    client: httpx.AsyncClient, username: str
) -> List[Dict[str, Any]]:
    """
    Fetch ALL public repos for a user using per_page=100 + Link-header
    pagination.  Works authenticated and unauthenticated.
    """
    url = f"{GITHUB_API_URL}/users/{username}/repos"
    params = {"sort": "pushed", "direction": "desc", "per_page": 100, "type": "public"}
    all_repos: List[Dict[str, Any]] = []

    while url:
        response = await client.get(url, headers=get_headers(), params=params)
        await check_response(response)
        page_repos = response.json()
        all_repos.extend(page_repos)
        # After the first request params are embedded in the next URL
        params = {}
        url = _parse_link_next(response.headers.get("Link"))

    return all_repos


# ---------------------------------------------------------------------------
# GraphQL calendar (requires token)
# ---------------------------------------------------------------------------
async def fetch_graphql_commits(
    client: httpx.AsyncClient, username: str
) -> Dict[str, Any]:
    query = """
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
    """
    response = await client.post(
        GRAPHQL_URL,
        headers=get_headers(),
        json={"query": query, "variables": {"login": username}},
    )
    await check_response(response)
    data = response.json()
    if "errors" in data:
        for err in data["errors"]:
            if err.get("type") == "NOT_FOUND":
                raise UserNotFoundException("User not found in GraphQL")
        raise Exception(f"GraphQL Error: {data['errors']}")
    return data["data"]["user"]["contributionsCollection"]["contributionCalendar"]


# ---------------------------------------------------------------------------
# REST commit-activity fallback (unauthenticated path)
# ---------------------------------------------------------------------------
async def fetch_repo_commit_activity(
    client: httpx.AsyncClient, username: str, repo_name: str, sem: asyncio.Semaphore
) -> List[int]:
    url = f"{GITHUB_API_URL}/repos/{username}/{repo_name}/stats/commit_activity"
    async with sem:
        try:
            response = await client.get(url, headers=get_headers())
            if response.status_code == 202:
                return [0] * 52
            if response.status_code == 204 or not response.content:
                return [0] * 52
            if response.status_code in (403, 429):
                return [0] * 52
            if response.status_code != 200:
                return [0] * 52
            weeks_data = response.json()
            if not isinstance(weeks_data, list):
                return [0] * 52
            
            totals = []
            for week in weeks_data[-52:]:
                if isinstance(week, dict):
                    totals.append(week.get("total", 0))
                else:
                    totals.append(0)
            if len(totals) < 52:
                totals = [0] * (52 - len(totals)) + totals
            return totals
        except Exception:
            return [0] * 52


async def fetch_commit_activity_rest(
    client: httpx.AsyncClient, username: str, repos: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Aggregate weekly commit counts across all repos concurrently.
    """
    weekly_totals = [0] * 52
    sem = asyncio.Semaphore(50)

    tasks = [
        fetch_repo_commit_activity(client, username, repo["name"], sem)
        for repo in repos
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    for totals in results:
        if isinstance(totals, list) and len(totals) == 52:
            for i in range(52):
                weekly_totals[i] += totals[i]

    # Build a calendar-shaped dict for analyze_commits()
    weeks = []
    for total in weekly_totals:
        weeks.append({"contributionDays": [{"contributionCount": total, "date": ""}]})

    return {
        "totalContributions": sum(weekly_totals),
        "weeks": weeks,
    }


# ---------------------------------------------------------------------------
# SSE formatter
# ---------------------------------------------------------------------------
def format_sse(event_type: str, data: Any) -> str:
    payload = json.dumps({"type": event_type, "data": data})
    return f"data: {payload}\n\n"


# ---------------------------------------------------------------------------
# Main orchestrator
# ---------------------------------------------------------------------------
async def stream_all_repo_data(username: str) -> AsyncGenerator[str, None]:
    """
    Orchestrates fetching all data for a user and yields SSE chunks.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            yield format_sse("progress", "Fetching user profile...")
            profile = await fetch_user_profile(client, username)

            yield format_sse("progress", "Discovering repositories...")
            all_repos = await fetch_all_repos(client, username)
            total_repos = len(all_repos)
            yield format_sse("progress", f"Discovered {total_repos} repositories...")

            # ---- Contribution calendar ----------------------------------------
            if GITHUB_TOKEN:
                yield format_sse("progress", "Fetching 52-week contribution calendar...")
                calendar = await fetch_graphql_commits(client, username)
            else:
                yield format_sse(
                    "progress",
                    "Fetching commit activity (unauthenticated REST mode)...",
                )
                calendar = await fetch_commit_activity_rest(client, username, all_repos)

            # ---- Per-repo README enrichment -----------------------------------
            enriched_repos = []
            if total_repos > 0:
                yield format_sse(
                    "progress", f"Analyzing 0 of {total_repos} repositories..."
                )
                
                sem = asyncio.Semaphore(50)
                
                async def check_readme_sem(r_name):
                    async with sem:
                        return await check_repo_readme(client, username, r_name)
                        
                tasks = [check_readme_sem(r["name"]) for r in all_repos]
                results = await asyncio.gather(*tasks, return_exceptions=True)

                for j, res in enumerate(results):
                    repo = all_repos[j]
                    has_readme = False
                    if isinstance(res, RateLimitException):
                        raise res
                    elif not isinstance(res, Exception):
                        has_readme = res

                    enriched_repos.append(
                        {
                            "name": repo["name"],
                            "stargazers_count": repo.get("stargazers_count", 0),
                            "forks_count": repo.get("forks_count", 0),
                            "description": repo.get("description", ""),
                            "language": repo["language"],
                            "size": repo["size"],
                            "has_license": bool(repo.get("license")),
                            "has_readme": has_readme,
                        }
                    )

                yield format_sse(
                    "progress",
                    f"Analyzed {total_repos} of {total_repos} repositories...",
                )

            final_data = {
                "profile": {
                    "login": profile["login"],
                    "name": profile.get("name"),
                    "avatar_url": profile["avatar_url"],
                    "followers": profile["followers"],
                    "following": profile.get("following", 0),
                    "public_repos": profile.get("public_repos", 0),
                    "public_gists": profile.get("public_gists", 0),
                    "created_at": profile.get("created_at"),
                },
                "calendar": calendar,
                "repos": enriched_repos,
            }

            yield format_sse("complete", final_data)

    except UserNotFoundException:
        yield format_sse("error", "GitHub user not found.")
    except UnauthorizedException:
        yield format_sse(
            "error", "Server GitHub token is invalid. Please contact the site owner."
        )
    except RateLimitException:
        yield format_sse(
            "error",
            "GitHub API rate limit exceeded. Please try again later.",
        )
    except Exception as e:
        logging.error(f"Error processing {username}: {e}")
        yield format_sse("error", f"An unexpected error occurred: {str(e)}")
