import React from 'react';
import { Code, ShieldCheck, Heart, Zap, Sparkles } from 'lucide-react';
import './AboutView.css';

function AboutView() {
  return (
    <div className="about-premium-container">
      <div className="about-header-section">
        <div className="about-badge">
          <Sparkles size={16} />
          <span>The GitPulse Manifesto</span>
        </div>
        <h2 className="about-title">
          Empowering Developers with <br/>
          <span className="about-title-gradient">Actionable Analytics</span>
        </h2>
        <p className="about-subtitle">
          We bridge the gap between raw repository activity and explainable, structured metrics built on modern open-source technologies.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <div className="about-card-icon-wrapper" style={{ backgroundColor: 'rgba(63,143,111,0.1)', color: '#3F8F6F' }}>
            <ShieldCheck size={32} />
          </div>
          <h3 className="about-card-title">Our Core Mission</h3>
          <p className="about-card-text">
            Public open-source contributions tell a unique developer story. We make that story clear and actionable by providing insights you can actually use.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon-wrapper" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
            <Zap size={32} />
          </div>
          <h3 className="about-card-title">High-Performance</h3>
          <p className="about-card-text">
            Powered by FastAPI and Python, our backend utilizes <code>asyncio.gather</code> and connection semaphores to fetch and process repository metadata concurrently.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon-wrapper" style={{ backgroundColor: 'rgba(217,164,65,0.1)', color: '#D9A441' }}>
            <Code size={32} />
          </div>
          <h3 className="about-card-title">Actionable Insights</h3>
          <p className="about-card-text">
            Instead of just showing numbers, GitPulse provides rule-based recommendations. We guide you step-by-step on how to improve your overall score.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon-wrapper" style={{ backgroundColor: 'rgba(244,63,94,0.1)', color: '#F43F5E' }}>
            <Heart size={32} />
          </div>
          <h3 className="about-card-title">100% Free to Use</h3>
          <p className="about-card-text">
            GitPulse operates entirely free of charge. By leveraging public GitHub endpoints, we ensure that every developer can audit their profile.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutView;
