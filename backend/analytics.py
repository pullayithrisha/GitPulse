from typing import Dict, Any, List
from datetime import datetime

# ── Score ceilings (sum = 100) ──────────────────────────────────────────────
MAX_REPO_QUALITY    = 25   # readme + license quality
MAX_COMMIT          = 20   # activity & consistency
MAX_COMMUNITY       = 25   # stars + forks
MAX_SOCIAL          = 15   # followers / ratio
MAX_LANGUAGE        = 10   # diversity
MAX_LONGEVITY       = 5    # account age
# Total max = 100


def calculate_analytics(data: Dict[str, Any]) -> Dict[str, Any]:
    repos   = data.get("repos", [])
    profile = data.get("profile", {})
    calendar = data.get("calendar", {})

    quality_data   = analyze_repo_quality(repos)
    commits_data   = analyze_commits(calendar)
    community_data = analyze_community(repos)
    social_data    = analyze_social(profile)
    lang_data      = analyze_languages(repos)
    longevity_data = analyze_longevity(profile)
    top_repos      = get_top_repos(repos)

    health_score = (
        quality_data["score"]
        + commits_data["score"]
        + community_data["score"]
        + social_data["score"]
        + lang_data["score"]
        + longevity_data["score"]
    )

    letter_grade = get_letter_grade(health_score)

    return {
        "health_score": round(health_score),
        "letter_grade": letter_grade,
        "breakdown": {
            "repo_quality":        quality_data["score"],
            "commit_consistency":  commits_data["score"],
            "community_impact":    community_data["score"],
            "social_influence":    social_data["score"],
            "language_diversity":  lang_data["score"],
            "account_longevity":   longevity_data["score"],
        },
        "max": {
            "repo_quality":        MAX_REPO_QUALITY,
            "commit_consistency":  MAX_COMMIT,
            "community_impact":    MAX_COMMUNITY,
            "social_influence":    MAX_SOCIAL,
            "language_diversity":  MAX_LANGUAGE,
            "account_longevity":   MAX_LONGEVITY,
        },
        "details": {
            "commits":    commits_data,
            "quality":    quality_data,
            "community":  community_data,
            "social":     social_data,
            "languages":  lang_data,
            "longevity":  longevity_data,
            "top_repos":  top_repos,
        },
    }


def get_letter_grade(score: int) -> str:
    if score >= 90: return "S"
    if score >= 80: return "A+"
    if score >= 70: return "A"
    if score >= 60: return "B+"
    if score >= 50: return "B"
    if score >= 40: return "C+"
    if score >= 30: return "C"
    return "D"


# ── Individual analysers ─────────────────────────────────────────────────────

def analyze_repo_quality(repos: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not repos:
        return {
            "score": 0,
            "readme_percent": 0,
            "license_percent": 0,
            "public_repos": 0,
        }
    total       = len(repos)
    with_readme   = sum(1 for r in repos if r.get("has_readme"))
    with_license  = sum(1 for r in repos if r.get("has_license"))
    readme_pct  = (with_readme  / total) * 100
    license_pct = (with_license / total) * 100
    # readme contributes 60 % of the ceiling, license 40 %
    score = (readme_pct / 100) * (MAX_REPO_QUALITY * 0.6) + \
            (license_pct / 100) * (MAX_REPO_QUALITY * 0.4)
    return {
        "score":           round(score, 1),
        "readme_percent":  round(readme_pct),
        "license_percent": round(license_pct),
        "public_repos":    total,
    }


def analyze_commits(calendar: Dict[str, Any]) -> Dict[str, Any]:
    weekly_activity = []
    weeks = calendar.get("weeks", [])
    for week in weeks:
        week_total = sum(
            day.get("contributionCount", 0)
            for day in week.get("contributionDays", [])
        )
        weekly_activity.append(week_total)
    if len(weekly_activity) > 52:
        weekly_activity = weekly_activity[-52:]

    active_weeks  = sum(1 for w in weekly_activity if w > 0)
    total_commits = sum(weekly_activity)

    longest_gap = current_gap = 0
    for w in weekly_activity:
        if w == 0:
            current_gap += 1
            longest_gap = max(longest_gap, current_gap)
        else:
            current_gap = 0

    base    = (active_weeks / 52) * MAX_COMMIT if active_weeks > 0 else 0
    penalty = max(0, longest_gap - 3) * (MAX_COMMIT * 0.05)
    score   = max(0, min(MAX_COMMIT, base - penalty))
    return {
        "score":              round(score, 1),
        "weekly_activity":    weekly_activity,
        "active_weeks":       active_weeks,
        "total_commits":      total_commits,
        "longest_gap_weeks":  longest_gap,
    }


def analyze_community(repos: List[Dict[str, Any]]) -> Dict[str, Any]:
    total_stars = sum(r.get("stargazers_count", 0) for r in repos)
    total_forks = sum(r.get("forks_count", 0)      for r in repos)
    # stars: up to 80 % of ceiling, forks up to 20 %
    s_score = min(MAX_COMMUNITY * 0.8, (total_stars / 50) * (MAX_COMMUNITY * 0.8)) if total_stars > 0 else 0
    f_score = min(MAX_COMMUNITY * 0.2, (total_forks / 20) * (MAX_COMMUNITY * 0.2)) if total_forks > 0 else 0
    score   = s_score + f_score
    return {
        "score":       round(score, 1),
        "total_stars": total_stars,
        "total_forks": total_forks,
    }


def analyze_social(profile: Dict[str, Any]) -> Dict[str, Any]:
    followers = profile.get("followers", 0)
    following  = profile.get("following", 0)
    f_score   = min(MAX_SOCIAL, (followers / 50) * MAX_SOCIAL) if followers > 0 else 0
    ratio     = round(followers / following, 2) if following > 0 else float(followers)
    return {
        "score":     round(f_score, 1),
        "followers": followers,
        "following": following,
        "ratio":     ratio,
    }


def analyze_languages(repos: List[Dict[str, Any]]) -> Dict[str, Any]:
    langs: Dict[str, int] = {}
    for repo in repos:
        lang = repo.get("language")
        if lang:
            langs[lang] = langs.get(lang, 0) + 1
    sorted_langs = sorted(langs.items(), key=lambda x: x[1], reverse=True)
    top_langs    = sorted_langs[:6]
    num_langs    = len(langs)

    if   num_langs == 0: score = 0
    elif num_langs == 1: score = MAX_LANGUAGE * 0.3
    elif num_langs == 2: score = MAX_LANGUAGE * 0.6
    elif num_langs == 3: score = MAX_LANGUAGE * 0.8
    else:                score = MAX_LANGUAGE

    return {
        "score":           round(score, 1),
        "total_languages": num_langs,
        "top_langs":       [{"language": k, "count": v} for k, v in top_langs],
    }


def analyze_longevity(profile: Dict[str, Any]) -> Dict[str, Any]:
    created_at = profile.get("created_at")
    years = 0
    if created_at:
        try:
            dt    = datetime.strptime(created_at.replace("Z", "+0000"), "%Y-%m-%dT%H:%M:%S%z")
            now   = datetime.now(dt.tzinfo)
            years = (now - dt).days / 365.25
        except Exception:
            pass
    score = min(MAX_LONGEVITY, (years / 5) * MAX_LONGEVITY) if years > 0 else 0
    return {
        "score":      round(score, 1),
        "years":      round(years, 1),
        "created_at": created_at,
    }


def get_top_repos(repos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    sorted_repos = sorted(
        repos,
        key=lambda r: (r.get("stargazers_count", 0), r.get("forks_count", 0)),
        reverse=True,
    )
    return sorted_repos[:6]
