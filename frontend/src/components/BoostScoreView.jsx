import React, { useState } from 'react';
import { 
  CheckCircle, 
  ShieldCheck, 
  Flame, 
  Users, 
  Share2, 
  Code, 
  Calendar 
} from 'lucide-react';

const boostGuidelines = [
  {
    category: "Repository Quality",
    icon: <ShieldCheck size={22} />,
    color: "#3F8F6F",
    maxPts: 25,
    tips: [
      "Create a detailed README.md for every repository explaining what the project does and how to run it (60% weight).",
      "Add a clear LICENSE file (like MIT or Apache 2.0) to explicitly state reuse rights (40% weight).",
      "Archive or delete empty, dummy, or temporary test repositories to keep your quality average high."
    ]
  },
  {
    category: "Activity & Consistency",
    icon: <Flame size={22} />,
    color: "#D9A441",
    maxPts: 20,
    tips: [
      "Commit smaller, atomic code changes regularly (e.g., 3-4 days a week) rather than huge dumps once a month.",
      "Avoid long periods of inactivity—gaps exceeding 4 weeks will trigger consistency score penalties.",
      "Set up a daily coding routine or participate in challenges like #100DaysOfCode to build consistency."
    ]
  },
  {
    category: "Community Impact",
    icon: <Users size={22} />,
    color: "#7F77DD",
    maxPts: 25,
    tips: [
      "Build projects that solve real-world problems and share them on Dev.to, Reddit, and LinkedIn to gain organic stars.",
      "Write clear contribution guidelines (CONTRIBUTING.md) to encourage forks and pull requests.",
      "Pin your top 6 most impressive repositories to your GitHub profile to attract stars from profile visitors."
    ]
  },
  {
    category: "Social Influence",
    icon: <Share2 size={22} />,
    color: "#3B82F6",
    maxPts: 15,
    tips: [
      "Contribute high-quality code, bug fixes, or documentation corrections to popular open-source repositories.",
      "Engage with the developer community by opening helpful issues, participating in discussions, and following peers.",
      "Keep a balanced follower-to-following ratio (aim for > 1.0x ratio) to establish organic social proof."
    ]
  },
  {
    category: "Language Diversity",
    icon: <Code size={22} />,
    color: "#F43F5E",
    maxPts: 10,
    tips: [
      "Build repositories using multiple languages (e.g., Python for scripts, JavaScript for web, Go/Rust for systems).",
      "Aim to use at least 4 distinct languages across your repository history to secure the maximum diversity score.",
      "Avoid committing multi-language monolothic repos; structure your code base clean with language tags."
    ]
  },
  {
    category: "Account Longevity",
    icon: <Calendar size={22} />,
    color: "#857C6E",
    maxPts: 5,
    tips: [
      "Keep your GitHub account active. The account age score increments steadily over a 5-year period.",
      "Maintain active repositories and update your profile biography, social links, and skills tags annually."
    ]
  }
];

function BoostScoreView() {
  // Store checked status in a dict mapping: "categoryName-tipIndex" -> boolean
  const [completedTips, setCompletedTips] = useState({});

  const handleToggleTip = (categoryName, tipIdx) => {
    const key = `${categoryName}-${tipIdx}`;
    setCompletedTips(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="boost-container">
      <div className="boost-intro">
        <h2>GitHub Profile Booster Guide</h2>
        <p>Follow this interactive checklist to optimize your engineering profile, increase your GitPulse score, and impress recruiters.</p>
      </div>

      <div className="boost-grid">
        {boostGuidelines.map((cat, catIdx) => {
          // Count completed items
          const completedCount = cat.tips.filter((_, tipIdx) => 
            completedTips[`${cat.category}-${tipIdx}`]
          ).length;
          const progressPercent = Math.round((completedCount / cat.tips.length) * 100);

          return (
            <div key={catIdx} className="glass-card boost-card">
              <div className="boost-card-header">
                <div className="boost-icon" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                  {cat.icon}
                </div>
                <div className="boost-title-group">
                  <h4>{cat.category}</h4>
                  <span className="boost-pts" style={{ color: cat.color }}>{cat.maxPts} Pts Max</span>
                </div>
              </div>

              {/* Progress bar for checked tips */}
              <div className="boost-progress-wrapper">
                <div className="boost-progress-meta">
                  <span>Task Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="progress-track" style={{ height: '4px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercent}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>

              {/* Checklist list */}
              <ul className="boost-tips-list">
                {cat.tips.map((tipText, tipIdx) => {
                  const isCompleted = !!completedTips[`${cat.category}-${tipIdx}`];
                  return (
                    <li 
                      key={tipIdx} 
                      className={`boost-tip-item ${isCompleted ? 'completed' : ''}`}
                      onClick={() => handleToggleTip(cat.category, tipIdx)}
                    >
                      <div className="boost-checkbox-wrapper">
                        {isCompleted ? (
                          <CheckCircle size={18} color={cat.color} fill={`${cat.color}15`} />
                        ) : (
                          <div className="boost-checkbox-empty"></div>
                        )}
                      </div>
                      <span className="boost-tip-text">{tipText}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoostScoreView;
