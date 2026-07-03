import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ScoreCard from './components/ScoreCard';
import LanguageChart from './components/LanguageChart';
import CommitActivityChart from './components/CommitActivityChart';
import RecommendationsList from './components/RecommendationsList';
import EmptyState from './components/EmptyState';
import MetricCard from './components/MetricCard';

// New View Imports
import CompareColumn from './components/CompareColumn';
import HowItWorksView from './components/HowItWorksView';
import AboutView from './components/AboutView';
import { GitPullRequest, Search, RefreshCw } from 'lucide-react';

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // 1. Home Profile State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressMsg, setProgressMsg] = useState('');
  const [eventSource, setEventSource] = useState(null);

  // 2. Comparison State
  const [compareMode, setCompareMode] = useState(2); // 2 or 3 devs
  const [devUsernames, setDevUsernames] = useState(['', '', '']);
  const [compareResults, setCompareResults] = useState([null, null, null]);
  const [compareLoading, setCompareLoading] = useState([false, false, false]);
  const [compareErrors, setCompareErrors] = useState([null, null, null]);
  const [compareProgress, setCompareProgress] = useState(['', '', '']);
  const [compareSources, setCompareSources] = useState([null, null, null]);

  // Clean up SSE connections on unmount
  useEffect(() => {
    return () => {
      if (eventSource) eventSource.close();
      compareSources.forEach(source => {
        if (source) source.close();
      });
    };
  }, [eventSource, compareSources]);

  // Analyze single profile
  const analyzeProfile = (searchUsername) => {
    if (!searchUsername) return;

    if (eventSource) eventSource.close();

    setLoading(true);
    setError(null);
    setData(null);
    setProgressMsg('Connecting to server...');

    const url = `http://localhost:8000/api/analyze/${searchUsername}`;
    const source = new EventSource(url);
    setEventSource(source);

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'progress') {
          setProgressMsg(payload.data);
        } else if (payload.type === 'complete') {
          setData(payload.data);
          source.close();
          setEventSource(null);
          setLoading(false);
        } else if (payload.type === 'error') {
          setError(payload.data);
          source.close();
          setEventSource(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    source.onerror = () => {
      setError('Connection lost. Please try again.');
      source.close();
      setEventSource(null);
      setLoading(false);
    };
  };

  // Compare developers submit
  const handleCompareSubmit = (e) => {
    e.preventDefault();

    // Close any previous connections
    compareSources.forEach(source => {
      if (source) source.close();
    });

    setCompareResults([null, null, null]);
    setCompareErrors([null, null, null]);
    setCompareProgress(['', '', '']);

    const activeCount = compareMode; // 2 or 3
    const newLoaders = [false, false, false];
    const newSources = [null, null, null];

    for (let i = 0; i < activeCount; i++) {
      const username = devUsernames[i]?.trim();
      if (!username) continue;

      newLoaders[i] = true;
      const url = `http://localhost:8000/api/analyze/${username}`;
      const source = new EventSource(url);
      newSources[i] = source;

      source.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'progress') {
            setCompareProgress(prev => {
              const next = [...prev];
              next[i] = payload.data;
              return next;
            });
          } else if (payload.type === 'complete') {
            setCompareResults(prev => {
              const next = [...prev];
              next[i] = payload.data;
              return next;
            });
            setCompareLoading(prev => {
              const next = [...prev];
              next[i] = false;
              return next;
            });
            source.close();
          } else if (payload.type === 'error') {
            setCompareErrors(prev => {
              const next = [...prev];
              next[i] = payload.data;
              return next;
            });
            setCompareLoading(prev => {
              const next = [...prev];
              next[i] = false;
              return next;
            });
            source.close();
          }
        } catch (err) {
          console.error(err);
        }
      };

      source.onerror = () => {
        setCompareErrors(prev => {
          const next = [...prev];
          next[i] = 'Could not connect to service.';
          return next;
        });
        setCompareLoading(prev => {
          const next = [...prev];
          next[i] = false;
          return next;
        });
        source.close();
      };
    }

    setCompareLoading(newLoaders);
    setCompareSources(newSources);
  };

  // Determine winner index (highest health score)
  const getWinnerIndex = () => {
    let maxScore = -1;
    let winnerIdx = -1;
    let activeCount = compareMode;

    for (let i = 0; i < activeCount; i++) {
      const result = compareResults[i];
      if (result && !compareLoading[i] && !compareErrors[i]) {
        const currentScore = result.analytics.health_score;
        if (currentScore > maxScore) {
          maxScore = currentScore;
          winnerIdx = i;
        }
      }
    }
    return winnerIdx;
  };

  const winnerIdx = getWinnerIndex();

  // Helper to check if comparisons are loading or fully loaded
  const isAnyCompareLoading = compareLoading.slice(0, compareMode).some(l => l);
  const hasAnyCompareResult = compareResults.slice(0, compareMode).some(r => r !== null);
  const hasCompareRun = isAnyCompareLoading || hasAnyCompareResult;

  return (
    <div className="app-container">
      {/* GLOBAL NAVBAR HEADER */}
      <header className="navbar-header">
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => setActiveTab('home')}>
            <GitPullRequest size={24} color="#7F77DD" />
            <span className="wordmark-text">GitPulse</span>
          </div>
          <nav>
            <ul className="navbar-menu">
              <li 
                className={`navbar-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </li>
              <li 
                className={`navbar-item ${activeTab === 'compare' ? 'active' : ''}`}
                onClick={() => setActiveTab('compare')}
              >
                Compare
              </li>
              <li 
                className={`navbar-item ${activeTab === 'how-it-works' ? 'active' : ''}`}
                onClick={() => setActiveTab('how-it-works')}
              >
                How It Works
              </li>
              <li 
                className={`navbar-item ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* RENDER VIEW ACCORDING TO ACTIVE TAB */}
      {activeTab === 'home' && (
        <>
          <div className="hero-section">
            <div className="hero-content">
              <SearchBar onSearch={analyzeProfile} isLoading={loading} />
            </div>
          </div>

          <div className="results-area">
            {error && (
              <EmptyState type="error" message={error} onRetry={() => setError(null)} />
            )}

            {loading && !data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                  {progressMsg}
                </p>
                <div className="skeleton sk-score-card glass-card"></div>
                <div className="metrics-grid">
                  <div className="skeleton sk-metric glass-card"></div>
                  <div className="skeleton sk-metric glass-card"></div>
                  <div className="skeleton sk-metric glass-card"></div>
                  <div className="skeleton sk-metric glass-card"></div>
                  <div className="skeleton sk-metric glass-card"></div>
                  <div className="skeleton sk-metric glass-card"></div>
                </div>
                <div className="charts-grid">
                  <div className="skeleton sk-chart glass-card"></div>
                  <div className="skeleton sk-chart glass-card"></div>
                </div>
              </div>
            )}

            {!loading && !data && !error && (
              <EmptyState type="empty" message="Enter a GitHub username above to get started." />
            )}

            {data && !loading && (
              <>
                <ScoreCard score={data.analytics.health_score} profile={data.profile} />

                <div className="metrics-grid">
                  <MetricCard label="Repo quality" score={data.analytics.breakdown.repo_quality} maxScore={data.analytics.max.repo_quality} />
                  <MetricCard label="Commit consistency" score={data.analytics.breakdown.commit_consistency} maxScore={data.analytics.max.commit_consistency} />
                  <MetricCard label="Community" score={data.analytics.breakdown.community_impact} maxScore={data.analytics.max.community_impact} />
                  <MetricCard label="Social influence" score={data.analytics.breakdown.social_influence} maxScore={data.analytics.max.social_influence} />
                  <MetricCard label="Language diversity" score={data.analytics.breakdown.language_diversity} maxScore={data.analytics.max.language_diversity} />
                  <MetricCard label="Account longevity" score={data.analytics.breakdown.account_longevity} maxScore={data.analytics.max.account_longevity} />
                </div>

                <div className="charts-grid">
                  <div className="glass-card chart-card">
                    <CommitActivityChart data={data.analytics.details.commits.weekly_activity} />
                  </div>
                  <div className="glass-card chart-card">
                    <LanguageChart data={data.analytics.details.languages.top_langs} />
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                  <RecommendationsList recommendations={data.recommendations} />
                </div>
              </>
            )}
          </div>
        </>
      )}

      {activeTab === 'compare' && (
        <div className="compare-container">
          <div className="compare-intro">
            <h2>Compare GitHub Scores</h2>
            <p>Enter developer usernames side-by-side to stack their profile metrics against each other, analyze their contributions, and find the winner.</p>
          </div>

          {/* Toggle comparison between 2 and 3 developers */}
          <div className="compare-toggle-bar">
            <div className="compare-toggle-pill">
              <button 
                className={`compare-toggle-btn ${compareMode === 2 ? 'active' : ''}`}
                onClick={() => {
                  setCompareMode(2);
                  setCompareResults([null, null, null]);
                  setCompareErrors([null, null, null]);
                }}
              >
                Compare 2
              </button>
              <button 
                className={`compare-toggle-btn ${compareMode === 3 ? 'active' : ''}`}
                onClick={() => {
                  setCompareMode(3);
                  setCompareResults([null, null, null]);
                  setCompareErrors([null, null, null]);
                }}
              >
                Compare 3
              </button>
            </div>
          </div>

          {/* Inputs Form */}
          <div className="compare-form-card">
            <form onSubmit={handleCompareSubmit}>
              <div className={`compare-inputs-grid ${compareMode === 2 ? 'cols-2' : 'cols-3'}`}>
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Developer 1 Username"
                    value={devUsernames[0]}
                    onChange={(e) => setDevUsernames(prev => [e.target.value, prev[1], prev[2]])}
                    required
                  />
                </div>
                
                <span className="compare-vs-divider">VS</span>

                <div className="input-wrapper">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Developer 2 Username"
                    value={devUsernames[1]}
                    onChange={(e) => setDevUsernames(prev => [prev[0], e.target.value, prev[2]])}
                    required
                  />
                </div>

                {compareMode === 3 && (
                  <>
                    <span className="compare-vs-divider">VS</span>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Developer 3 Username"
                        value={devUsernames[2]}
                        onChange={(e) => setDevUsernames(prev => [prev[0], prev[1], e.target.value])}
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="compare-submit-wrapper">
                <button 
                  type="submit" 
                  className="primary-button active"
                  disabled={isAnyCompareLoading}
                >
                  {isAnyCompareLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" style={{ animation: 'loading-shimmer 2s infinite linear' }} />
                      Comparing...
                    </>
                  ) : (
                    'Compare Developers'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Compare Results / Progress list */}
          {hasCompareRun && (
            <div className="compare-results-section">
              {/* Progress indicators while loading */}
              {isAnyCompareLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {compareLoading.map((isLoading, i) => {
                    if (i >= compareMode || !isLoading) return null;
                    return (
                      <div key={i} className="compare-progress-card">
                        <span className="compare-progress-label">Developer {i + 1} ({devUsernames[i]}):</span>
                        <span className="compare-progress-text">{compareProgress[i] || 'Connecting...'}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Side-by-side Results Grid */}
              <div className={`compare-grid ${compareMode === 2 ? 'cols-2' : 'cols-3'}`}>
                {compareLoading.map((isLoading, i) => {
                  if (i >= compareMode) return null;
                  if (isLoading) {
                    return (
                      <div key={`sk-${i}`} className="skeleton glass-card" style={{ height: '550px' }}></div>
                    );
                  }
                  if (compareErrors[i]) {
                    return (
                      <div key={`err-${i}`} className="glass-card center-state" style={{ height: '100%', justifyContent: 'center' }}>
                        <p style={{ color: 'var(--danger)', fontWeight: '600' }}>Error</p>
                        <p style={{ fontSize: '13px' }}>{compareErrors[i]}</p>
                      </div>
                    );
                  }
                  if (compareResults[i]) {
                    return (
                      <CompareColumn 
                        key={`res-${i}`} 
                        data={compareResults[i]} 
                        isWinner={winnerIdx === i} 
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'how-it-works' && <HowItWorksView />}

      {activeTab === 'about' && <AboutView />}
    </div>
  );
}

export default App;
