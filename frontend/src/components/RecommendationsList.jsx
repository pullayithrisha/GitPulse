import { useEffect, useState } from 'react';
import { FileText, GitBranch, GitCommit, Target, Zap } from 'lucide-react';

// Simple heuristic to pick an icon based on text content
const getIconForText = (text) => {
  const t = text.toLowerCase();
  if (t.includes('readme') || t.includes('license')) return <FileText size={18} />;
  if (t.includes('commit') || t.includes('activity')) return <GitCommit size={18} />;
  if (t.includes('open source') || t.includes('community')) return <GitBranch size={18} />;
  if (t.includes('language') || t.includes('explore')) return <Zap size={18} />;
  return <Target size={18} />;
};

function RecommendationsList({ recommendations }) {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    // Wait for the score animation to finish (1.2s), then stagger 100ms
    const startDelay = 1200;
    const timeouts = [];

    recommendations.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, startDelay + (index * 100));
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [recommendations]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="recs-header">Recommendations</h3>
      <ul className="recs-list">
        {recommendations.map((rec, index) => {
          const isVisible = visibleItems.includes(index);
          return (
            <li 
              key={index} 
              className={`rec-item ${isVisible ? 'animate-in' : ''}`}
            >
              <div className="rec-icon">
                {getIconForText(rec)}
              </div>
              <div>{rec}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecommendationsList;
