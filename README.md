# GitPulse ⚡

GitPulse is a developer-focused, full-stack GitHub profile analytics and comparison dashboard. It connects to GitHub's REST and GraphQL APIs to compile a composite **GitHub Health Score (0–100)** based on repository quality, commit consistency, community impact, social influence, language diversity, and account longevity. It features interactive data visualizations, automated profile recommendations, and a side-by-side comparison engine for up to 3 developers.

---

## 🚀 Key Features

* **Composite Health Score (0–100)**: Evaluates profile strength across 6 weighted categories with real-time feedback.
* **Asynchronous Speed Optimizations**: Backend queries (commit logs, repository README presence) are executed in parallel via concurrent workers (`asyncio.gather`), lowering complete analysis latency from 15s to **under 7 seconds** for public profiles.
* **Developer Matchup (Compare 2 or 3 Devs)**: Compare up to 3 developers side-by-side in parallel. Uses parallel client-side streams, dynamic score calculations, and displays a bouncing `👑 WINNER` banner for the highest-scoring candidate.
* **Explainable Recommendations**: An automated, rule-based advisory engine suggests adjustments to repository licenses, documentation, and activity patterns to optimize candidate profiles for recruiters.
* **Animated Data Visualizations**: Render 52-week commit histograms and primary programming language distributions dynamically via `recharts`.
* **State-of-the-Art Light UI Theme**: Sleek `#FBF7F0` custom beige-white layout with drop-shadow elevations, progress bars, and glowing interactive indicators.

---

## 📊 Scoring Methodology

Your GitPulse Health Score is compiled out of 100 maximum points. The formula is split across the following key dimensions:

| Component | Max Points | Metric Tracked |
| :--- | :--- | :--- |
| **Repository Quality** | 25 pts | Percentage of repositories containing a `README.md` (60% weight) and an open-source license (40% weight). |
| **Activity & Consistency** | 20 pts | Weekly commit frequency over the past 12 months. Penalizes long periods of inactivity (> 4 weeks gap). |
| **Community Impact** | 25 pts | Sum of stars (80% weight) and forks (20% weight) received across public repositories. |
| **Social Influence** | 15 pts | Follower count and follower-to-following ratio acting as community social proof. |
| **Language Diversity** | 10 pts | Count of distinct programming languages used across public repositories (rewards versatility at 4+ languages). |
| **Account Longevity** | 5 pts | Total years the GitHub profile has existed (up to 5 years). |

---

## 🛠️ Tech Stack

### Backend
* **FastAPI (Python)**: High-performance, asynchronous web server framework.
* **Uvicorn**: ASGI web server implementation.
* **HTTPX**: Asynchronous HTTP client to orchestrate non-blocking GitHub API requests.
* **Asyncio (Semaphore)**: Throttled concurrency pool (`max_limit=25` parallel connections) to speed up REST activity requests safely on Windows/Linux environments.
* **Server-Sent Events (SSE)**: Streams chunked progress logs (*"Discovering repositories..."*, *"Analyzing README files..."*) in real-time.
* **In-Memory Cache**: 15-minute TTL-based cache mapping usernames to calculated scores to prevent API rate-limit exhaustion.

### Frontend
* **React (Vite)**: Component-based view layout with rapid hot-reloading.
* **Vanilla CSS**: Custom visual design tokens, variable light theme styles, and smooth micro-animations.
* **Recharts**: D3-backed canvas renderer for charts and tooltip hover popups.
* **Lucide React**: Clean vector icon indicators.

---

## 📁 Repository Structure

```text
Gitpulse/
├── backend/
│   ├── main.py              # FastAPI server, endpoints, and SSE endpoints
│   ├── github_api.py        # GraphQL and REST concurrent fetching modules
│   ├── analytics.py         # 100-point composite scoring logic and thresholds
│   ├── recommendations.py   # Rule-based developer profile recommendation engine
│   ├── requirements.txt     # Python server dependencies
│   └── .env                 # Server-side environment variables (tokens)
├── frontend/
│   ├── src/
│   │   ├── components/      # UI cards, charts, about views, and columns
│   │   ├── App.jsx          # Tab router, compare logic, and SSE streams
│   │   ├── App.css          # Theme styles, compare grids, and active buttons
│   │   └── main.jsx         # Vite entrypoint
│   ├── package.json         # Node scripts & dependencies
│   └── vite.config.js       # Vite configuration
└── README.md                # Detailed project overview and setups
```

---

## 💻 Local Setup Instructions

### Prerequisites
* [Python 3.9+](https://www.python.org/downloads/)
* [Node.js 16+](https://nodejs.org/)
* A GitHub Personal Access Token (PAT) - *Optional, but recommended to avoid rate limits (60/hr unauthenticated vs 5000/hr authenticated).*

### 1. Backend Server Setup
1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Create a `.env` file and paste your GitHub token:
   ```env
   GITHUB_TOKEN=your_personal_access_token_here
   ```
4. Start the server using Uvicorn:
   ```bash
   python -m uvicorn main:app --port 8000
   ```
   *The backend API will run locally at `http://localhost:8000`.*

### 2. Frontend Dashboard Setup
1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Start the local dev server:
   ```bash
   npm run dev
   ```
   *The web app will run locally at `http://localhost:5173`.*

---

## 🔒 API Usage & Rate Limits

GitPulse uses the unauthenticated GitHub REST API by default. For public requests, GitHub enforces a limit of **60 requests per hour**. 

For production use or high-density comparisons (e.g. comparing 3 developers concurrently), you should set a `GITHUB_TOKEN` in the `backend/.env` file. This elevates your limit to **5,000 requests per hour** and unlocks the authenticated GitHub GraphQL v4 calendar api, enabling single-request retrievals.
