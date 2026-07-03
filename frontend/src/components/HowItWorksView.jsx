import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Users, 
  Share2, 
  Code, 
  Calendar 
} from 'lucide-react';

const methodology = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Repository Quality",
    points: "25 Points Max",
    desc: "Evaluates the overall quality of public repositories by checking the presence of a README.md (60% weight) and an open-source license like MIT or Apache (40% weight). READMEs ensure discoverability, while licenses guarantee open-source reuse rights."
  },
  {
    icon: <Flame size={28} />,
    title: "Activity & Consistency",
    points: "20 Points Max",
    desc: "Analyzes weekly commit frequency over the past 12 months. Having steady weekly contributions builds active habits. Long stretches of inactivity (gaps exceeding 4 weeks) will introduce moderate penalties to discourage burst activity."
  },
  {
    icon: <Users size={28} />,
    title: "Community Impact",
    points: "25 Points Max",
    desc: "Measures overall engagement by totaling stars (80% weight) and forks (20% weight) received across all public repositories. Higher counts reflect community utility, interest, and real-world project impact."
  },
  {
    icon: <Share2 size={28} />,
    title: "Social Influence",
    points: "15 Points Max",
    desc: "Based on your total GitHub follower count and your follower-to-following ratio. Followers act as a social proof of reputation and authority in the engineering community."
  },
  {
    icon: <Code size={28} />,
    title: "Language Diversity",
    points: "10 Points Max",
    desc: "Rewards versatility by counting distinct programming languages used across public repositories. Slicing through multiple environments (at least 4 different languages for max score) indicates quick adaptability."
  },
  {
    icon: <Calendar size={28} />,
    title: "Account Longevity",
    points: "5 Points Max",
    desc: "Grants points based on how long your GitHub profile has existed (up to 5 years). Longevity reflects a sustained commitment to software development and open-source contributions."
  }
];

function HowItWorksView() {
  return (
    <div className="methodology-container">
      <div className="methodology-intro">
        <h2>Our Scoring Methodology</h2>
        <p>GitPulse evaluates public profile metadata to compile a single Health Score out of 100 points. Here is how your rating is broken down:</p>
      </div>

      <div className="methodology-grid">
        {methodology.map((item, index) => (
          <div key={index} className="glass-card methodology-card">
            <div className="methodology-card-header">
              <div className="methodology-icon">
                {item.icon}
              </div>
              <div className="methodology-title-group">
                <h4>{item.title}</h4>
                <span className="methodology-pts">{item.points}</span>
              </div>
            </div>
            <p className="methodology-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorksView;
