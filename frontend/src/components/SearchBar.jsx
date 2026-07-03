import { useState } from 'react';
import { GitPullRequest, Search } from 'lucide-react';

function SearchBar({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  const isFormValid = username.trim().length > 0;

  return (
    <div>
      <div className="wordmark">
        <GitPullRequest size={28} color="#7F77DD" />
        <span className="wordmark-text">GitPulse</span>
      </div>
      <p className="tagline">Analyze your complete GitHub profile health, activity, and quality across all repositories.</p>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          className={`primary-button ${isFormValid ? 'active' : ''}`}
          disabled={isLoading || !isFormValid}
        >
          <Search size={18} />
          {isLoading ? 'Analyzing...' : 'Analyze profile'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
