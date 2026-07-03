import React from 'react';

// Get grade title based on score (similar to frontend badge and backend descriptions)
const getGradeTitle = (score) => {
  if (score >= 90) return "Expert Developer";
  if (score >= 80) return "Strong Profile";
  if (score >= 70) return "Solid Contributor";
  if (score >= 60) return "Growing Developer";
  if (score >= 50) return "Building Momentum";
  if (score >= 40) return "Emerging Developer";
  if (score >= 30) return "Active Learner";
  return "Needs Work";
};

const getLetterGrade = (score) => {
  if (score >= 90) return "S";
  if (score >= 80) return "A+";
  if (score >= 70) return "A";
  if (score >= 60) return "B+";
  if (score >= 50) return "B";
  if (score >= 40) return "C+";
  if (score >= 30) return "C";
  return "D";
};

function CompareColumn({ data, isWinner }) {
  if (!data) return null;

  const { profile, analytics } = data;
  const score = analytics.health_score;
  const grade = getLetterGrade(score);
  const title = getGradeTitle(score);

  // Compute total stars
  const totalStars = analytics.details.community.total_stars;

  // Metric definitions mapped with labels, keys, and max values
  const metrics = [
    { label: "Repository Quality", val: analytics.breakdown.repo_quality, max: analytics.max.repo_quality },
    { label: "Activity & Consistency", val: analytics.breakdown.commit_consistency, max: analytics.max.commit_consistency },
    { label: "Community Impact", val: analytics.breakdown.community_impact, max: analytics.max.community_impact },
    { label: "Social Influence", val: analytics.breakdown.social_influence, max: analytics.max.social_influence },
    { label: "Language Diversity", val: analytics.breakdown.language_diversity, max: analytics.max.language_diversity },
    { label: "Account Longevity", val: analytics.breakdown.account_longevity, max: analytics.max.account_longevity }
  ];

  return (
    <div className={`glass-card compare-column ${isWinner ? 'winner-highlight' : ''}`}>
      {isWinner && (
        <div className="winner-ribbon">
          <span>👑 WINNER</span>
        </div>
      )}

      <div className="compare-user-header">
        <img 
          src={profile.avatar_url} 
          alt={`${profile.login} avatar`} 
          className="compare-avatar" 
        />
        <h3 className="compare-name">{profile.name || profile.login}</h3>
        <span className="compare-username">@{profile.login}</span>
      </div>

      <div className="compare-score-section">
        <span className="compare-score-value">{score}</span>
        <div className="compare-grade-badge-wrapper">
          <span className="compare-grade-letter">{grade}</span>
          <span className="compare-grade-title">{title}</span>
        </div>
      </div>

      <div className="compare-metrics-list">
        {metrics.map((m, index) => {
          const percentage = m.max > 0 ? (m.val / m.max) * 100 : 0;
          let fillClass = 'fill-green';
          if (percentage < 40) fillClass = 'fill-red';
          else if (percentage < 70) fillClass = 'fill-amber';

          return (
            <div key={index} className="compare-metric-row">
              <div className="compare-metric-meta">
                <span className="compare-metric-label">{m.label}</span>
                <span className="compare-metric-scores">
                  <span className="compare-metric-val">{m.val}</span>
                  <span className="compare-metric-max">/{m.max}</span>
                </span>
              </div>
              <div className="progress-track">
                <div 
                  className={`progress-fill ${fillClass}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="compare-stats-footer">
        <div className="compare-stat-item">
          <span className="compare-stat-num">{profile.public_repos}</span>
          <span className="compare-stat-lbl">Repos</span>
        </div>
        <div className="compare-stat-item">
          <span className="compare-stat-num">{totalStars}</span>
          <span className="compare-stat-lbl">Stars</span>
        </div>
        <div className="compare-stat-item">
          <span className="compare-stat-num">{profile.followers}</span>
          <span className="compare-stat-lbl">Followers</span>
        </div>
      </div>
    </div>
  );
}

export default CompareColumn;
