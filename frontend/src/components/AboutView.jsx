import React from 'react';
import { GitPullRequest, Code, ShieldCheck, Heart, Zap } from 'lucide-react';

function AboutView() {
  return (
    <div className="about-hero-container">
      <div className="about-manifesto glass-card">
        <div className="about-manifesto-header">
          <div className="about-manifesto-icon">
            <GitPullRequest size={48} color="#7F77DD" />
          </div>
          <h2>The GitPulse Manifesto</h2>
          <p className="about-manifesto-subtitle">
            Providing actionable, high-fidelity profile health analytics built on modern open-source technologies.
          </p>
        </div>

        <div className="about-manifesto-content">
          <div className="about-manifesto-block">
            <div className="block-icon" style={{ backgroundColor: 'rgba(63,143,111,0.1)', color: '#3F8F6F' }}>
              <ShieldCheck size={24} />
            </div>
            <div className="block-text">
              <h3>Our Core Mission</h3>
              <p>GitPulse was created to bridge the gap between raw repository activity and explainable, structured metrics. We believe that public open-source contributions tell a unique developer story. Our goal is to make that story clear and actionable.</p>
            </div>
          </div>

          <div className="about-manifesto-block">
            <div className="block-icon" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
              <Zap size={24} />
            </div>
            <div className="block-text">
              <h3>High-Performance Architecture</h3>
              <p>Powered by FastAPI and Python, our backend utilizes <code>asyncio.gather</code> and connection semaphores to fetch and process dozens of repository metadata concurrently, keeping analysis times lightning fast.</p>
            </div>
          </div>

          <div className="about-manifesto-block">
            <div className="block-icon" style={{ backgroundColor: 'rgba(217,164,65,0.1)', color: '#D9A441' }}>
              <Code size={24} />
            </div>
            <div className="block-text">
              <h3>Actionable Insights</h3>
              <p>Instead of just showing numbers, GitPulse provides rule-based recommendations. It guides you step-by-step on how to improve your score by adding licenses, readmes, and maintaining consistent commit schedules.</p>
            </div>
          </div>

          <div className="about-manifesto-block">
            <div className="block-icon" style={{ backgroundColor: 'rgba(244,63,94,0.1)', color: '#F43F5E' }}>
              <Heart size={24} />
            </div>
            <div className="block-text">
              <h3>100% Free to Use</h3>
              <p>GitPulse operates entirely free of charge. By leveraging public GitHub endpoints, we ensure that every developer can audit their profile without any subscription barriers.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutView;
