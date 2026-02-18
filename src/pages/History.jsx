import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, MessageSquare, Clock, ChevronRight, Search, Github, FileArchive } from 'lucide-react';
import { getAllCodebases, getHistory } from '../services/api';

const History = ({ showToast }) => {
    const navigate = useNavigate();
    const [codebases, setCodebases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCodebase, setSelectedCodebase] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCodebases();
    }, []);

    const fetchCodebases = async () => {
        setLoading(true);
        try {
            const data = await getAllCodebases();
            setCodebases(data?.codebases || []);
        } catch {
            showToast?.('Failed to load codebases', 'error');
            setCodebases([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async (codebase) => {
        setSelectedCodebase(codebase);
        setQuestionsLoading(true);
        setQuestions([]);
        try {
            const data = await getHistory(codebase._id);
            setQuestions(data?.questions || []);
        } catch {
            showToast?.('Failed to load questions', 'error');
        } finally {
            setQuestionsLoading(false);
        }
    };

    const filteredCodebases = codebases.filter(cb =>
        cb.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', padding: '3rem 1.5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* ── Header ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '2px', background: '#aaff00' }} />
                        <span className="section-label">Codebase History</span>
                        <div style={{ width: '40px', height: '2px', background: '#aaff00' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>All Sessions</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '2px solid #2a2a2a', padding: '0.5rem 1rem', minWidth: '240px' }}>
                            <Search size={14} style={{ color: '#555', flexShrink: 0 }} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search codebases..."
                                style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', width: '100%', fontFamily: 'Space Grotesk, sans-serif' }}
                            />
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                        <div className="spinner" />
                    </div>
                ) : filteredCodebases.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card"
                        style={{ padding: '4rem', textAlign: 'center' }}>
                        <Folder size={48} style={{ color: '#2a2a2a', margin: '0 auto 1.5rem' }} />
                        <div style={{ fontWeight: 800, color: '#444', fontSize: '1rem', marginBottom: '0.5rem' }}>No Codebases Yet</div>
                        <p style={{ color: '#333', fontSize: '0.85rem', marginBottom: '2rem' }}>Upload a ZIP or connect a GitHub repo to get started.</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>
                            Go to Home →
                        </button>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: selectedCodebase ? '1fr 1.4fr' : '1fr', gap: '1.25rem' }}>

                        {/* ── Codebase Cards ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {filteredCodebases.map((cb, i) => {
                                const isSelected = selectedCodebase?._id === cb._id;
                                return (
                                    <motion.div
                                        key={cb._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        whileHover={{ y: -4 }}
                                        onClick={() => fetchQuestions(cb)}
                                        className="glass-card"
                                        style={{
                                            padding: '1.75rem 1.5rem',
                                            cursor: 'pointer',
                                            border: isSelected ? '1.5px solid rgba(170,255,0,0.6) !important' : undefined,
                                            boxShadow: isSelected ? '0 0 24px rgba(170,255,0,0.12)' : undefined,
                                        }}
                                    >
                                        {/* Icon box */}
                                        <div style={{
                                            width: '40px', height: '40px',
                                            background: 'rgba(170,255,0,0.1)',
                                            border: '2px solid rgba(170,255,0,0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#aaff00',
                                            marginBottom: '1rem',
                                        }}>
                                            {cb.source === 'github'
                                                ? <Github size={18} />
                                                : <FileArchive size={18} />
                                            }
                                        </div>

                                        {/* Name */}
                                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>
                                            {cb.name}
                                        </div>

                                        {/* Meta row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#555', fontSize: '0.75rem', fontFamily: 'Space Mono, monospace' }}>
                                                <Folder size={12} />
                                                {cb.file_count ?? '—'} files
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#555', fontSize: '0.75rem', fontFamily: 'Space Mono, monospace' }}>
                                                <Clock size={12} />
                                                {cb.created_at ? new Date(cb.created_at).toLocaleDateString() : '—'}
                                            </div>
                                            <span style={{
                                                background: cb.source === 'github' ? 'rgba(170,255,0,0.12)' : 'rgba(100,100,255,0.12)',
                                                color: cb.source === 'github' ? '#aaff00' : '#8888ff',
                                                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                                                textTransform: 'uppercase', padding: '0.15rem 0.5rem',
                                                border: `1px solid ${cb.source === 'github' ? 'rgba(170,255,0,0.25)' : 'rgba(100,100,255,0.25)'}`,
                                            }}>
                                                {cb.source}
                                            </span>
                                        </div>

                                        {/* CTA row */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(170,255,0,0.08)' }}>
                                            <button
                                                className="btn-primary"
                                                style={{ fontSize: '0.72rem', padding: '0.45rem 1rem', letterSpacing: '0.1em' }}
                                                onClick={e => { e.stopPropagation(); navigate(`/qa/${cb._id}`); }}
                                            >
                                                Open Q&A →
                                            </button>
                                            <ChevronRight size={16} style={{ color: isSelected ? '#aaff00' : '#333', transition: 'color 0.2s' }} />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* ── Questions Panel ── */}
                        <AnimatePresence>
                            {selectedCodebase && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-card"
                                    style={{ padding: '2rem', alignSelf: 'start', position: 'sticky', top: '80px' }}
                                >
                                    {/* Panel header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(170,255,0,0.1)' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#aaff00', boxShadow: '0 0 6px rgba(170,255,0,0.8)' }} />
                                        <span className="section-label">Questions — {selectedCodebase.name}</span>
                                    </div>

                                    {questionsLoading ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                                            <div className="spinner" />
                                        </div>
                                    ) : questions.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                            <MessageSquare size={36} style={{ color: '#2a2a2a', margin: '0 auto 1rem' }} />
                                            <p style={{ color: '#444', fontSize: '0.85rem' }}>No questions asked yet for this codebase.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '65vh', overflowY: 'auto', paddingRight: '2px' }}>
                                            {questions.map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    whileHover={{ y: -4 }}
                                                    className="glass-card"
                                                    style={{ padding: '1.1rem', cursor: 'pointer' }}
                                                    onClick={() => navigate(`/qa/${selectedCodebase._id}`)}
                                                >
                                                    {/* Icon box */}
                                                    <div style={{
                                                        width: '32px', height: '32px',
                                                        background: 'rgba(170,255,0,0.1)',
                                                        border: '2px solid rgba(170,255,0,0.3)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#aaff00',
                                                        marginBottom: '0.75rem',
                                                    }}>
                                                        <MessageSquare size={14} />
                                                    </div>

                                                    {/* Question */}
                                                    <div style={{
                                                        fontWeight: 800, fontSize: '0.82rem', color: '#fff',
                                                        marginBottom: '0.35rem', lineHeight: 1.5,
                                                        overflow: 'hidden', display: '-webkit-box',
                                                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                    }}>
                                                        {item.question}
                                                    </div>

                                                    {/* Date */}
                                                    <div style={{ color: '#555', fontSize: '0.68rem', fontFamily: 'Space Mono, monospace', marginBottom: item.tags?.length > 0 ? '0.5rem' : 0 }}>
                                                        {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}
                                                    </div>

                                                    {/* Tags */}
                                                    {item.tags?.length > 0 && (
                                                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                                            {item.tags.slice(0, 3).map((tag, ti) => (
                                                                <span key={ti} className="tag" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{tag}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
