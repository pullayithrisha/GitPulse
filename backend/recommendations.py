from typing import Dict, Any, List

def generate_recommendations(analytics_data: Dict[str, Any]) -> List[str]:
    recs = []
    
    commits = analytics_data["details"]["commits"]
    quality = analytics_data["details"]["quality"]
    langs = analytics_data["details"]["languages"]
    
    # 1. Commits based recs
    if commits["longest_gap_weeks"] > 4:
         recs.append(f"You have a gap of {commits['longest_gap_weeks']} weeks in your recent commit history. Try spreading your contributions out—consistent activity shows sustained engagement to recruiters.")
    elif commits["active_weeks"] < 12:
         recs.append("Your commit frequency is relatively low. Committing smaller, more frequent updates can help showcase an active development habit.")
    else:
         recs.append("Great job maintaining a consistent commit history! This demonstrates strong dedication and steady progress.")

    # 2. Repo quality based recs
    if quality["readme_percent"] < 80:
         missing = round(100 - quality["readme_percent"])
         recs.append(f"About {missing}% of your recent repos are missing a README. This is often the first thing reviewers check—adding one greatly improves repo discoverability and understanding.")
         
    if quality["license_percent"] < 50:
         recs.append("Many of your repositories lack an open-source license. Adding a license (like MIT or Apache) makes it clear how others can use your work.")
         
    # 3. Languages based
    if langs["total_languages"] < 3:
         recs.append("Your repositories are heavily focused on a single language. Consider exploring new frameworks or languages to show versatility.")
         
    # Fallbacks if we don't have enough recs
    if len(recs) < 3:
         recs.append("Consider contributing to open source projects to boost your community engagement and stars.")
         
    if len(recs) < 3:
         recs.append("Pin your best repositories to your profile to make a strong first impression on visitors.")
         
    return recs[:4]
