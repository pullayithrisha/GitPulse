import React from 'react';
import { 
  Compass, 
  Layers, 
  LineChart, 
  GitCompare, 
  CheckCircle2 
} from 'lucide-react';

function AboutView() {
  return (
    <div className="about-container">
      <div className="about-split-layout">
        {/* Left Column: Heading and Platform Concept */}
        <div className="about-header-column">
          <div className="about-badge">ABOUT GITPULSE</div>
          <h2 className="about-main-heading">
            Elevating GitHub Profile Analytics to the Next Level
          </h2>
          <p className="about-mission">
            GitPulse bridges the gap between raw repository activity and explainable metrics. We believe public open-source contributions tell a developer's story—our mission is to make that story clear, structured, and actionable.
          </p>
          <div className="about-key-features-list">
            <div className="about-key-feature-item">
              <CheckCircle2 size={18} color="#3F8F6F" />
              <span>100% Free of Cost (Public GitHub API)</span>
            </div>
            <div className="about-key-feature-item">
              <CheckCircle2 size={18} color="#3F8F6F" />
              <span>Parallel SSE-Stream Real-Time Analysis</span>
            </div>
            <div className="about-key-feature-item">
              <CheckCircle2 size={18} color="#3F8F6F" />
              <span>Comparison Engine for up to 3 Developers</span>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Advantage Cards */}
        <div className="about-cards-column">
          {/* Card 1 */}
          <div className="glass-card about-detail-card">
            <div className="about-detail-icon purple">
              <Compass size={24} />
            </div>
            <div className="about-detail-text">
              <h4>Explainable Audits</h4>
              <p>
                No more guessing. We audit public repo licenses, commit counts, and readmes to compile a structured 0–100 health score mapping directly to specific point allocations.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card about-detail-card">
            <div className="about-detail-icon green">
              <Layers size={24} />
            </div>
            <div className="about-detail-text">
              <h4>Asynchronous Speed</h4>
              <p>
                Our FastAPI backend utilizes concurrent worker pools to execute parallel repository requests, keeping complete analyses under 7 seconds—even for large accounts.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card about-detail-card">
            <div className="about-detail-icon blue">
              <LineChart size={24} />
            </div>
            <div className="about-detail-text">
              <h4>Actionable Booster Tips</h4>
              <p>
                Receive automated, rule-based suggestions outlining the exact paths to boost your profile, fix missing documents, and raise your global grade.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card about-detail-card">
            <div className="about-detail-icon amber">
              <GitCompare size={24} />
            </div>
            <div className="about-detail-text">
              <h4>Multi-Developer Matches</h4>
              <p>
                Recruiters and hiring managers can test up to 3 developers concurrently. We spin up parallelSSE streams, side-by-side cards, and crown the winner dynamically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutView;
