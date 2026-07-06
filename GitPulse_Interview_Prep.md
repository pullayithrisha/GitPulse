# GitPulse: Complete Interview Preparation Guide

This document is your crystal-clear, end-to-end guide for explaining **GitPulse** in a software engineering interview. It covers everything from architecture and tech stack choices to algorithms, GitHub API constraints, and expected interview questions.

---

## 1. Project Overview & Features

**GitPulse** is a full-stack web application designed to analyze a developer's GitHub profile and generate a comprehensive "Health Score" (0-100) and letter grade (S, A+, A, etc.). 

### Core Features
1. **Real-time Profile Analysis**: Users enter a GitHub username. The backend streams real-time progress to the frontend using Server-Sent Events (SSE) while it fetches repositories, commits, and profile data.
2. **Health Score Generation**: A proprietary algorithm grades the developer based on 6 pillars: Repository Quality, Commit Consistency, Community Impact, Social Influence, Language Diversity, and Account Longevity.
3. **Developer Comparison**: Allows comparing 2 or 3 developers side-by-side to see who has a healthier open-source presence.
4. **Actionable Recommendations**: Based on the analytics, the system provides tailored tips (e.g., "Add READMEs to your repos", "Increase commit frequency").
5. **Data Visualization**: Uses responsive charts to display 52-week commit activity and top programming languages.

---

## 2. Tech Stack: "Why this and not that?"

### Frontend: React + Vite + Vanilla CSS
* **Why React?** React's component-based architecture is perfect for building modular UI elements like charts, scorecards, and comparison columns. State management makes handling loading states, errors, and live SSE streams highly efficient.
* **Why Vite (instead of Create React App)?** Vite uses native ES modules, resulting in near-instant server starts and blazingly fast Hot Module Replacement (HMR). CRA is heavily outdated and slow.
* **Why Vanilla CSS (instead of Tailwind or Bootstrap)?** To create a highly bespoke, premium "glassmorphic" UI with micro-animations. Vanilla CSS offers maximum control without the overhead of learning utility classes, proving strong foundational frontend skills.
* **Libraries**: `Recharts` (for lightweight, responsive graphs), `lucide-react` (for modern, scalable vector icons).

### Backend: FastAPI (Python)
* **Why FastAPI (instead of Node.js/Express or Django)?** 
  * **Asynchronous by Design**: FastAPI natively supports `asyncio`, which is crucial for making dozens of simultaneous external API calls to GitHub.
  * **Data Processing**: Python excels at data manipulation and algorithmic scoring.
  * **Speed**: It is built on Starlette and Pydantic, making it one of the fastest Python frameworks available.
* **Why Server-Sent Events (SSE) instead of WebSockets?** WebSockets are bidirectional. GitPulse only requires one-way communication (server streaming progress updates to the client). SSE is natively supported over standard HTTP, making it simpler to implement and easier to scale.

---

## 3. GitHub API Integration & Rate Limits

Fetching an entire profile requires multiple API calls. This is where the backend architecture shines.

### How the APIs Work
1. **REST API**: Used to fetch the basic user profile, list all public repositories (handling pagination via the `Link` header), and check for the presence of `README.md` files.
2. **GraphQL API**: Used specifically to fetch the 52-week contribution calendar. GraphQL allows fetching this highly nested data in a single request, saving bandwidth.

### Handling Rate Limits (Crucial Interview Topic)
GitHub imposes strict rate limits: **60 requests/hour** unauthenticated, and **5,000 requests/hour** authenticated (via `GITHUB_TOKEN`).
* **Graceful Fallback**: The `github_api.py` script checks for an environment variable (`GITHUB_TOKEN`). If present, it uses authenticated GraphQL + REST. If missing, it gracefully falls back to a REST-only unauthenticated mode.
* **Concurrency Control**: When analyzing repositories (e.g., checking if 100 repos have READMEs), the backend uses `asyncio.gather` to run requests concurrently. However, it implements an `asyncio.Semaphore(50)` to ensure we never blast GitHub with more than 50 simultaneous connections, preventing immediate rate-limit bans (HTTP 429).
* **In-Memory Caching**: To save rate limits, `main.py` implements a dictionary-based cache. If a user searches for "torvalds", the result is cached for 15 minutes (`CACHE_EXPIRY = 900`). Subsequent searches return the cached result instantly without touching the GitHub API.

---

## 4. The Analytics Algorithm

How is the score (max 100) calculated in `analytics.py`?

1. **Repository Quality (Max 25 pts)**: Checks what percentage of repositories have a `README.md` (60% weight) and a License (40% weight).
2. **Commit Consistency (Max 20 pts)**: Evaluates 52-week activity. Penalizes users for long periods of inactivity (gaps > 3 weeks).
3. **Community Impact (Max 25 pts)**: Based on total Stars (80% weight) and Forks (20% weight) across all repos. Caps out at 50 stars and 20 forks to normalize scores.
4. **Social Influence (Max 15 pts)**: Based on Followers and the Follower-to-Following ratio.
5. **Language Diversity (Max 10 pts)**: Iterates through all repos, extracts the `language` field, and builds a frequency dictionary. 1 language = 3 pts, 3 languages = 8 pts, 4+ languages = 10 pts.
6. **Account Longevity (Max 5 pts)**: Calculates the difference between `created_at` and `datetime.now()`. Caps at 5 years.

---

## 5. Basic Project Questions & Answers

**Q: How do you handle CORS in this project?**
**A:** In `main.py`, I use FastAPI's `CORSMiddleware` and set `allow_origins=["*"]` to allow the React frontend (running on a different port, like 5173) to communicate with the Python backend (running on port 8000). 

**Q: How did you implement the frontend layout to be responsive?**
**A:** I used CSS Flexbox and Grid. I designed it "mobile-first", utilizing media queries (e.g., `@media (min-width: 768px)`) to expand single-column grids into multi-column layouts on larger screens. I also built a custom mobile hamburger menu for navigation.

**Q: What happens if a user inputs an invalid GitHub username?**
**A:** The backend HTTP client (`httpx`) catches the HTTP 404 response from GitHub, raises a custom `UserNotFoundException`, and streams an error event via SSE. The React frontend listens for this error event and displays a clean empty state UI message.

---

## 6. Most Expected Advanced Interview Questions (With Answers)

### Q1: Why did you choose to use `asyncio` and `httpx` instead of the standard `requests` library in Python?
**A:** The standard `requests` library is synchronous and blocking. If a user has 100 repositories, checking the README for each sequentially would take over a minute, leading to a terrible user experience. By using `httpx` and `asyncio.gather`, I can make these external HTTP calls concurrently. What would take 60 seconds synchronously takes only 2-3 seconds asynchronously, drastically improving performance.

### Q2: You mentioned using an `asyncio.Semaphore`. What is that and why is it necessary?
**A:** A Semaphore is a synchronization primitive that limits the number of tasks that can access a shared resource simultaneously. While concurrency is great, firing 500 API calls to GitHub in the exact same millisecond will trigger their DDoS protection or rate limiters (HTTP 429). By wrapping my requests in `asyncio.Semaphore(50)`, I guarantee that no more than 50 connections are actively hitting GitHub at any given moment, creating a smooth, safe pipeline.

### Q3: How exactly does Server-Sent Events (SSE) work in your code?
**A:** In FastAPI, I return a `StreamingResponse` linked to an async generator. As the backend hits different milestones (e.g., "Fetching profile", "Analyzing repos"), it uses `yield` to push a formatted string (`data: {...}\n\n`) to the client. On the React side, I instantiate the browser's native `EventSource` API to listen to this stream and update the state (`setProgressMsg`), giving the user real-time visual feedback without the heavy overhead of establishing a WebSocket connection.

### Q4: If this application scaled to 10,000 daily active users, how would you upgrade the architecture?
**A:** 
1. **Caching**: I would replace the in-memory Python dictionary cache with a distributed cache like **Redis**. This allows multiple load-balanced backend instances to share the same cache.
2. **Message Queue**: For extremely heavy profiles (e.g., a user with 500+ repos), I would offload the scraping to a background worker using **Celery** or **RabbitMQ** to prevent locking up the FastAPI worker threads.
3. **Authentication**: I would implement GitHub OAuth. Instead of using a single server-side `GITHUB_TOKEN` which would quickly exhaust its 5,000 req/hr limit, I would have users log in with their own GitHub accounts, meaning the rate limits are applied per-user rather than to my server.

### Q5: How do you calculate the Top Programming Languages?
**A:** The GitHub API returns a primary `language` string for each repository. In `analytics.py`, I initialize an empty Python dictionary. I iterate over every repository in the array; if it has a language, I increment the count in the dictionary (`langs[lang] = langs.get(lang, 0) + 1`). Finally, I sort the dictionary by its values in descending order using Python's `sorted()` function with a lambda key, and slice the top 6 for the frontend charts.
