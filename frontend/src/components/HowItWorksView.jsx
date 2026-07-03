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
    formula: "Score = (README% × 15) + (License% × 10)",
    desc: "Evaluates the overall quality of your public repositories. The score is calculated based on README presence and Open-Source licenses across all public repos.",
    details: [
      "README Presence (60% weight / 15 pts max): Rewards repositories that explain project setup and goals.",
      "Open-Source License (40% weight / 10 pts max): Checks if projects have a LICENSE file (like MIT or Apache) to allow legal code usage and modifications."
    ]
  },
  {
    icon: <Flame size={28} />,
    title: "Activity & Consistency",
    points: "20 Points Max",
    formula: "Score = max(0, min(20, Base - Penalty))",
    desc: "Measures contribution patterns over the past 52 weeks. Consistency points reward steady contributions rather than massive single-day updates.",
    details: [
      "Base Score (20 pts max): Calculated as (Active Weeks / 52) × 20 points, where an active week is any week with at least 1 commit.",
      "Inactivity Penalty: Deducts 1 point (5% of max) for every week of consecutive inactivity beyond a 3-week gap threshold."
    ]
  },
  {
    icon: <Users size={28} />,
    title: "Community Impact",
    points: "25 Points Max",
    formula: "Score = min(20, (Stars/50) × 20) + min(5, (Forks/20) × 5)",
    desc: "Measures public utility, adoption, and engagement of your software products based on stars and forks accumulated.",
    details: [
      "Stars (80% weight / 20 pts max): Points grow linearly and cap at 50 stars received across repositories.",
      "Forks (20% weight / 5 pts max): Points grow linearly and cap at 20 forks received across repositories."
    ]
  },
  {
    icon: <Share2 size={28} />,
    title: "Social Influence",
    points: "15 Points Max",
    formula: "Score = min(15, (Followers/50) × 15)",
    desc: "Reflects your general standing and reputation within the GitHub community. Followers serve as organic social proof.",
    details: [
      "Follower Base (15 pts max): Points grow linearly and cap at 50 followers.",
      "Follower/Following Ratio: Recorded and displayed to highlight community influence (ideal ratio > 1.0x)."
    ]
  },
  {
    icon: <Code size={28} />,
    title: "Language Diversity",
    points: "10 Points Max",
    formula: "Score: 1 language = 3pts, 2 = 6pts, 3 = 8pts, 4+ = 10pts",
    desc: "Rewards engineering versatility by analyzing programming languages used across public repositories.",
    details: [
      "Polyglot Bonus (10 pts max): Reaching 4 or more distinct programming languages achieves the full score ceiling.",
      "Ensures developer points are rewarded for exploring diverse tech stacks (e.g. frontend, backend, systems, scripting)."
    ]
  },
  {
    icon: <Calendar size={28} />,
    title: "Account Longevity",
    points: "5 Points Max",
    formula: "Score = min(5, (Account Age in Years / 5) × 5)",
    desc: "Rewards sustained software development commitment. Longevity is calculated from profile creation date relative to current time.",
    details: [
      "Age Points (5 pts max): Grinds 1 point per year of profile history up to a 5-year maximum ceiling.",
      "Shows recruiters long-term commitment and persistence in technical contributions."
    ]
  }
];

function HowItWorksView() {
  return (
    <div className="methodology-container">
      <div className="methodology-intro">
        <h2>Our Detailed Scoring Methodology</h2>
        <p>GitPulse translates public metadata into a single Profile Health Score out of 100 points. Here are the detailed equations, weights, and point ceilings used in calculations:</p>
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
            
            <div className="methodology-formula-badge">
              <code>{item.formula}</code>
            </div>

            <p className="methodology-desc">{item.desc}</p>
            
            <ul className="methodology-details-list">
              {item.details.map((detail, dIdx) => (
                <li key={dIdx}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorksView;
