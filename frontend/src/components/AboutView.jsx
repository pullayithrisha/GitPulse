import React from 'react';
import { Terminal, Users, Cpu, ShieldAlert } from 'lucide-react';

function AboutView() {
  return (
    <div className="about-container">
      <div className="glass-card about-card">
        <h2 className="about-title">About GitPulse</h2>
        <p className="about-intro">
          GitPulse is a developer-focused analytics dashboard designed to compute a clean, objective <strong>GitHub Profile Health Score</strong>. By looking at public repository activity, community metrics, code diversity, and documentation practices, GitPulse compiles an instant benchmark report.
        </p>

        <div className="about-grid">
          <div className="about-item">
            <div className="about-item-icon">
              <Terminal size={22} />
            </div>
            <div>
              <h5>For Developers</h5>
              <p>Benchmark your open-source presence, identify weak spots in repository documentation or licenses, and receive automated recommendations on how to polish your public profile for recruiters.</p>
            </div>
          </div>

          <div className="about-item">
            <div className="about-item-icon">
              <Users size={22} />
            </div>
            <div>
              <h5>For Recruiters & Managers</h5>
              <p>Compare candidates side-by-side. Understand developer activity patterns and open-source contributions without having to manually read hundreds of repository logs.</p>
            </div>
          </div>

          <div className="about-item">
            <div className="about-item-icon">
              <Cpu size={22} />
            </div>
            <div>
              <h5>Tech Stack</h5>
              <p>Built with Fast API (Python) for fast concurrently gathered server-side calculations, React (Vite) for state transitions and tab views, and Recharts for clean data visualizations.</p>
            </div>
          </div>

          <div className="about-item">
            <div className="about-item-icon">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h5>Rate Limits & Costs</h5>
              <p>GitPulse operates entirely free of cost. It makes use of the standard, public GitHub APIs. Unauthenticated queries are limited to 60 queries/hour, but you can configure a personal access token for higher limits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutView;
