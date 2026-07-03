import React from 'react';
import { Compass, Layers, LineChart, CheckCircle2, Globe, Heart } from 'lucide-react';

const aboutDetails = [
  {
    icon: <Compass size={28} />,
    title: "Our Mission",
    desc: "GitPulse was created to bridge the gap between raw repository activity and explainable, structured metrics. We believe that public open-source contributions tell a unique developer story. Our goal is to make that story clear and actionable.",
    color: "#7F77DD"
  },
  {
    icon: <Layers size={28} />,
    title: "Asynchronous Speed",
    desc: "Powered by FastAPI and Python, our backend utilizes asyncio.gather and connection semaphores to fetch and process dozens of repository metadata concurrently, keeping analysis times lightning fast.",
    color: "#3F8F6F"
  },
  {
    icon: <LineChart size={28} />,
    title: "Actionable Insights",
    desc: "Instead of just showing numbers, GitPulse provides rule-based recommendations. It guides you step-by-step on how to improve your score by adding licenses, readmes, and maintaining consistent commit schedules.",
    color: "#3B82F6"
  },
  {
    icon: <CheckCircle2 size={28} />,
    title: "Developer Matchups",
    desc: "Recruiters and hiring managers can test up to 3 developers concurrently. We spin up parallel SSE streams to compare side-by-side cards and crown the winner dynamically.",
    color: "#D9A441"
  },
  {
    icon: <Globe size={28} />,
    title: "Data Layer",
    desc: "Integrates both GitHub REST API (v3) and GraphQL API (v4) to aggregate deep commit histories and rich public metadata directly from the source.",
    color: "#F43F5E"
  },
  {
    icon: <Heart size={28} />,
    title: "100% Free to Use",
    desc: "GitPulse operates entirely free of charge. By leveraging public GitHub endpoints, we ensure that every developer can audit their profile without any subscription barriers.",
    color: "#857C6E"
  }
];

function AboutView() {
  return (
    <div className="methodology-container">
      <div className="methodology-intro">
        <h2>About GitPulse</h2>
        <p>Providing developers and recruiters with actionable, high-fidelity profile health analytics built on modern open-source technologies.</p>
      </div>

      <div className="methodology-grid">
        {aboutDetails.map((item, index) => (
          <div key={index} className="glass-card methodology-card">
            <div className="methodology-card-header">
              <div 
                className="methodology-icon" 
                style={{ color: item.color, backgroundColor: `${item.color}15` }}
              >
                {item.icon}
              </div>
              <div className="methodology-title-group">
                <h4 style={{ fontSize: '18px' }}>{item.title}</h4>
              </div>
            </div>
            <p className="methodology-desc" style={{ marginTop: '12px' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutView;
