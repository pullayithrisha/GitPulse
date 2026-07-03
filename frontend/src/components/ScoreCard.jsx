import { useEffect, useState } from 'react';

function ScoreCard({ score, profile }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const incrementTime = 20;
    const steps = duration / incrementTime;
    const increment = score / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.ceil(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 66; // 140px total, stroke 8px (140 - 8)/2 = 66
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  let badgeClass = 'needs-work';
  let badgeText = 'Needs work';
  if (score >= 80) {
    badgeClass = 'strong';
    badgeText = 'Strong profile';
  } else if (score >= 50) {
    badgeClass = 'momentum';
    badgeText = 'Building momentum';
  }

  return (
    <div className="glass-card score-card-full">
      <div className="score-card-content">
        <div className="score-ring-wrapper">
          <svg className="score-ring-svg" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1D9E75" />
                <stop offset="100%" stopColor="#7F77DD" />
              </linearGradient>
            </defs>
            <circle 
              className="score-ring-bg" 
              cx="70" 
              cy="70" 
              r={radius} 
            />
            <circle 
              className="score-ring-progress" 
              cx="70" 
              cy="70" 
              r={radius} 
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="score-number">
            <span className="score-value">{displayScore}</span>
            <span className="score-max">/ 100</span>
          </div>
        </div>
        
        <div className="score-info">
          <span className="score-info-title">GitHub health score</span>
          <div className="score-user">
            <img src={profile.avatar_url} alt="Avatar" className="score-avatar" />
            <span className="score-username">{profile.login}</span>
            <span style={{ color: 'var(--text-muted)' }}>• {profile.followers} followers</span>
          </div>
          <div className={`badge ${badgeClass}`}>{badgeText}</div>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;
