import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Link, Search, Star, GitFork, Loader as LucideLoader, ChevronDown } from 'lucide-react';
import Loader from './Loader';

const GithubCard = ({ id, onSubmit, loading, githubUrl, setGithubUrl }) => {
    const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'url'

    // Browse tab state
    const [username, setUsername] = useState('');
    const [repos, setRepos] = useState([]);
    const [fetchingRepos, setFetchingRepos] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [selectedRepo, setSelectedRepo] = useState(null);

    const fetchRepos = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;
        setFetchingRepos(true);
        setFetchError('');
        setRepos([]);
        setSelectedRepo(null);
        try {
            const res = await fetch(
                `https://api.github.com/users/${username.trim()}/repos?sort=updated&per_page=30&type=public`
            );
            if (!res.ok) {
                if (res.status === 404) throw new Error('User not found');
                throw new Error('GitHub API error');
            }
            const data = await res.json();
            setRepos(data);
        } catch (err) {
            setFetchError(err.message);
        } finally {
            setFetchingRepos(false);
        }
    };

    const handleSelectAndClone = (repo) => {
        setSelectedRepo(repo);
        setGithubUrl(repo.html_url);
    };

    const handleBrowseSubmit = (e) => {
        e.preventDefault();
        if (!selectedRepo) return;
        onSubmit(e);
    };

    const tabStyle = (tab) => ({
        flex: 1,
        padding: '0.65rem 1rem',
        background: activeTab === tab ? '#aaff00' : 'transparent',
        color: activeTab === tab ? '#0a0a0a' : '#666',
        border: 'none',
        borderBottom: activeTab === tab ? 'none' : '2px solid #2a2a2a',
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '0.78rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
    });

    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card"
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            {/* Header */}
            <div style={{ padding: '2rem 2rem 1.25rem' }}>
                <div className="section-label" style={{ marginBottom: '0.75rem' }}>Option 02</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>GitHub Repository</h2>
                <p style={{ color: '#888', fontSize: '0.82rem' }}>Browse your account or paste a direct link.</p>
            </div>

            {/* Tabs & Content or Loader */}
            {loading ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                    <Loader />
                    <p style={{ marginTop: '2rem', color: '#aaff00', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                        SCANNING REPOSITORY...
                    </p>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderTop: '2px solid #2a2a2a', borderBottom: '2px solid #2a2a2a' }}>
                        <button style={tabStyle('browse')} onClick={() => setActiveTab('browse')}>
                            <Github size={13} /> Browse Account
                        </button>
                        <button style={{ ...tabStyle('url'), borderLeft: '2px solid #2a2a2a' }} onClick={() => setActiveTab('url')}>
                            <Link size={13} /> Paste URL
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div style={{ padding: '1.5rem 2rem 2rem', flex: 1 }}>
                        <AnimatePresence mode="wait">

                            {/* ── BROWSE TAB ── */}
                            {activeTab === 'browse' && (
                                <motion.div key="browse" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                    {/* Username search */}
                                    <form onSubmit={fetchRepos} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <input
                                            type="text"
                                            className="input-glass"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter GitHub username"
                                            disabled={fetchingRepos}
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={fetchingRepos || !username.trim()}
                                            style={{
                                                background: 'linear-gradient(180deg, #ccff33 0%, #aaff00 100%)',
                                                color: '#0a0a0a',
                                                border: 'none',
                                                borderRadius: '9999px',
                                                padding: '0 1.25rem',
                                                cursor: 'pointer',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                fontSize: '0.8rem',
                                                flexShrink: 0,
                                                opacity: fetchingRepos || !username.trim() ? 0.5 : 1,
                                                boxShadow: '0 4px 12px rgba(170, 255, 0, 0.4)'
                                            }}
                                        >
                                            {fetchingRepos
                                                ? <LucideLoader size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
                                                : <Search size={14} />
                                            }
                                            Fetch
                                        </button>
                                    </form>

                                    {/* Error */}
                                    {fetchError && (
                                        <p style={{ color: '#ff4444', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 600 }}>
                                            ⚠ {fetchError}
                                        </p>
                                    )}

                                    {/* Repo list */}
                                    {repos.length > 0 && (
                                        <>
                                            <p style={{ color: '#555', fontSize: '0.72rem', fontFamily: 'Space Mono, monospace', marginBottom: '0.6rem' }}>
                                                {repos.length} public repos found — select one:
                                            </p>
                                            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '1rem' }}>
                                                {repos.map(repo => {
                                                    const isSelected = selectedRepo?.id === repo.id;
                                                    return (
                                                        <button
                                                            key={repo.id}
                                                            type="button"
                                                            onClick={() => handleSelectAndClone(repo)}
                                                            className="glass-card"
                                                            style={{
                                                                border: `1.5px solid ${isSelected ? '#aaff00' : 'rgba(170,255,0,0.12)'}`,
                                                                padding: '0.7rem 0.9rem',
                                                                textAlign: 'left',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s',
                                                                width: '100%',
                                                                background: isSelected ? 'rgba(170,255,0,0.1)' : 'rgba(20,20,20,0.55)',
                                                            }}
                                                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#444'; }}
                                                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#2a2a2a'; }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                                                <span style={{ color: isSelected ? '#aaff00' : 'ccc', fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {repo.name}
                                                                </span>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                                                    {repo.language && (
                                                                        <span style={{ color: '#555', fontSize: '0.65rem', fontFamily: 'Space Mono, monospace' }}>{repo.language}</span>
                                                                    )}
                                                                    <span style={{ color: '#555', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                                        <Star size={10} /> {repo.stargazers_count}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {repo.description && (
                                                                <p style={{ color: '#555', fontSize: '0.72rem', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {repo.description}
                                                                </p>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Scan selected */}
                                            <button
                                                onClick={handleBrowseSubmit}
                                                disabled={!selectedRepo || loading}
                                                className="btn-primary"
                                                style={{ width: '100%', justifyContent: 'center', opacity: !selectedRepo ? 0.4 : 1 }}
                                            >
                                                <Github size={15} /> Scan {selectedRepo ? `"${selectedRepo.name}"` : 'Selected Repo'}
                                            </button>
                                        </>
                                    )}

                                    {/* Empty state */}
                                    {repos.length === 0 && !fetchingRepos && !fetchError && (
                                        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#333', fontSize: '0.8rem' }}>
                                            Enter a GitHub username and click Fetch
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ── URL TAB ── */}
                            {activeTab === 'url' && (
                                <motion.div key="url" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                                Repository URL
                                            </label>
                                            <input
                                                type="text"
                                                className="input-glass"
                                                value={githubUrl}
                                                onChange={(e) => setGithubUrl(e.target.value)}
                                                placeholder="https://github.com/user/repo"
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* Quick examples */}
                                        <div>
                                            <p style={{ color: '#444', fontSize: '0.7rem', marginBottom: '0.5rem', fontFamily: 'Space Mono, monospace' }}>Quick examples:</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {['facebook/react', 'expressjs/express', 'vitejs/vite'].map(repo => (
                                                    <button
                                                        key={repo}
                                                        type="button"
                                                        onClick={() => setGithubUrl(`https://github.com/${repo}`)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid #3a3a3a',
                                                            borderRadius: '9999px',
                                                            color: '#555',
                                                            fontSize: '0.68rem',
                                                            padding: '0.25rem 0.6rem',
                                                            cursor: 'pointer',
                                                            fontFamily: 'Space Mono, monospace',
                                                            transition: 'all 0.15s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#aaff00'; e.currentTarget.style.color = '#aaff00'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#555'; }}
                                                    >
                                                        {repo}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading || !githubUrl.trim()}>
                                            <Github size={15} /> Scan & Analyze
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default GithubCard;
