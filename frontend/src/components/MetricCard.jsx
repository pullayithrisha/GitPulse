import { useEffect, useState } from 'react';

function MetricCard({ label, score, maxScore = 100 }) {
  const [fillWidth, setFillWidth] = useState(0);
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  useEffect(() => {
    // Delay slightly for smooth entrance
    const timer = setTimeout(() => {
      setFillWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  let fillClass = 'fill-green';
  if (percentage < 40) {
    fillClass = 'fill-red';
  } else if (percentage < 70) {
    fillClass = 'fill-amber';
  }

  return (
    <div className="glass-card metric-card">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value-container">
        <span className="metric-value">{score} </span>
        <span className="metric-value-max">/ {maxScore}</span>
      </div>
      <div className="progress-track">
        <div 
          className={`progress-fill ${fillClass}`} 
          style={{ width: `${fillWidth}%` }}
        ></div>
      </div>
    </div>
  );
}

export default MetricCard;
