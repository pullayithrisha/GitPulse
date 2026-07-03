import React from 'react';
import { GitPullRequest, Code, Database, Globe } from 'lucide-react';

function AboutView() {
  return (
    <div className="about-container-simple">
      <div className="about-header-simple">
        <GitPullRequest size={48} color="#7F77DD" style={{ marginBottom: '16px' }} />
        <h2 className="about-title-simple">About GitPulse</h2>
        <p className="about-subtitle-simple">Providing actionable, explainable GitHub profile analytics.</p>
      </div>

      <div className="about-content-simple glass-card">
        <section className="about-section-simple">
          <h3>Our Mission</h3>
          <p>
            GitPulse was created to bridge the gap between raw repository activity and explainable, structured metrics. We believe that public open-source contributions tell a unique developer story. Our goal is to make that story clear and actionable for developers, recruiters, and open-source maintainers.
          </p>
        </section>

        <section className="about-section-simple">
          <h3>How It's Built</h3>
          <p>
            The platform is engineered using a modern, full-stack architecture prioritizing speed and concurrency:
          </p>
          <ul className="about-list-simple">
            <li>
              <Code size={18} color="#3F8F6F" />
              <strong>Frontend:</strong> Built with React and Vite, featuring custom CSS styling and interactive Recharts data visualizations.
            </li>
            <li>
              <Database size={18} color="#3B82F6" />
              <strong>Backend:</strong> Powered by FastAPI and Python, utilizing <code>asyncio.gather</code> and connection semaphores to fetch and process dozens of repository metadata concurrently.
            </li>
            <li>
              <Globe size={18} color="#D9A441" />
              <strong>Data Layer:</strong> Integrates both GitHub REST API (v3) and GraphQL API (v4) to aggregate deep commit histories seamlessly.
            </li>
          </ul>
        </section>

        <section className="about-section-simple">
          <h3>Free & Open Source</h3>
          <p>
            GitPulse operates entirely free of charge. By leveraging public GitHub API endpoints, we ensure that every developer can audit their profile and gain actionable insights without any barriers.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutView;
