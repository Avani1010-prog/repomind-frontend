import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Tag, Sparkles, FileCode, MessageSquare } from 'lucide-react';
import { askQuestion, getHistory, generateRefactor } from '../services/api';
import CodeSnippet from '../components/CodeSnippet';
import Mermaid from '../components/Mermaid';
import Loader from '../components/Loader';

const QAInterface = ({ showToast }) => {
    const { codebaseId } = useParams();
    const [question, setQuestion] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [history, setHistory] = useState([]);
    const [refactorSuggestions, setRefactorSuggestions] = useState(null);
    const [loadingRefactor, setLoadingRefactor] = useState(false);

    useEffect(() => { loadHistory(); }, [codebaseId]);

    const loadHistory = async () => {
        try {
            const response = await getHistory(codebaseId);
            const questions = response?.questions;
            setHistory(Array.isArray(questions) ? questions : []);
        } catch (error) {
            console.error('Failed to load history:', error);
            setHistory([]);
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim()) { showToast('Enter a question', 'error'); return; }
        setLoading(true);
        setRefactorSuggestions(null);
        try {
            const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
            const response = await askQuestion(codebaseId, question, tagArray);
            setCurrentAnswer({
                question,
                answer: response.answer,
                mermaidCode: response.mermaidCode,
                fileReferences: response.fileReferences,
                tags: tagArray
            });
            setQuestion('');
            setTags('');
            loadHistory();
            showToast('Answer ready!', 'success');
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to get answer', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateRefactor = async (code, language) => {
        setLoadingRefactor(true);
        try {
            const response = await generateRefactor(code, language);
            setRefactorSuggestions(response.suggestions);
            showToast('Refactor suggestions ready', 'success');
        } catch {
            showToast('Failed to generate suggestions', 'error');
        } finally {
            setLoadingRefactor(false);
        }
    };

    const priorityColor = (p) => p === 'high' ? '#ff4444' : p === 'medium' ? '#ffcc00' : '#aaff00';

    return (
        <div style={{ minHeight: '100vh' }}>
            <div className="qa-layout">

                {/* ── MAIN AREA ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Question Input */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                        style={{ padding: '2rem' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#aaff00', boxShadow: '0 0 8px rgba(170,255,0,0.8)' }} />
                            <span className="section-label">Ask a Question</span>
                        </div>

                        <form onSubmit={handleAskQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g. Where is authentication handled? How do retries work?"
                                className="input-glass"
                                style={{ height: '120px', resize: 'none' }}
                                disabled={loading}
                                onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') handleAskQuestion(e); }}
                            />

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Tag size={14} style={{ color: '#666', flexShrink: 0 }} />
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="Tags: auth, api, database"
                                        className="input-glass"
                                        disabled={loading}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" disabled={loading} style={{ flexShrink: 0 }}>
                                    {loading
                                        ? <>Analyzing...</>
                                        : <><Send size={15} /> Ask</>
                                    }
                                </button>
                            </div>

                            <p style={{ color: '#444', fontSize: '0.72rem', fontFamily: 'Space Mono, monospace' }}>
                                Ctrl+Enter to submit
                            </p>
                        </form>
                    </motion.div>

                    {/* Answer or Loader */}
                    {(loading || currentAnswer) && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                            style={{ padding: '2rem' }}>

                            {loading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
                                    <Loader />
                                    <p style={{ marginTop: '2rem', color: '#aaff00', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em', animation: 'pulse 1.5s infinite' }}>
                                        ANALYZING CODEBASE...
                                    </p>
                                </div>
                            ) : (
                                <>

                                    {/* Question */}
                                    <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(170,255,0,0.1)' }}>
                                        <div className="section-label" style={{ marginBottom: '0.75rem' }}>Question</div>
                                        <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.6 }}>{currentAnswer.question}</p>
                                        {currentAnswer.tags?.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                                {currentAnswer.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Mermaid Diagram */}
                                    {currentAnswer.mermaidCode && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Visual Overview</div>
                                            <Mermaid chart={currentAnswer.mermaidCode} />
                                        </div>
                                    )}

                                    {/* Answer */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div className="section-label" style={{ marginBottom: '0.75rem' }}>Answer</div>
                                        <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{currentAnswer.answer}</p>
                                    </div>

                                    {/* File References */}
                                    {currentAnswer.fileReferences?.length > 0 && (
                                        <div>
                                            <div className="section-label" style={{ marginBottom: '1rem' }}>Code References ({currentAnswer.fileReferences.length})</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {currentAnswer.fileReferences.map((ref, i) => (
                                                    <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                                                        {/* File header */}
                                                        <div style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            padding: '0.75rem 1rem',
                                                            borderBottom: '1px solid rgba(170,255,0,0.1)',
                                                            background: 'rgba(170,255,0,0.04)',
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <FileCode size={14} style={{ color: '#aaff00', filter: 'drop-shadow(0 0 4px rgba(170,255,0,0.6))' }} />
                                                                <span style={{ color: '#aaff00', fontFamily: 'Space Mono, monospace', fontSize: '0.78rem', textShadow: '0 0 8px rgba(170,255,0,0.5)' }}>{ref.file}</span>
                                                                <span style={{ color: '#555', fontSize: '0.72rem', fontFamily: 'Space Mono, monospace' }}>
                                                                    L{ref.lineStart}–{ref.lineEnd}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleGenerateRefactor(ref.snippet, 'javascript')}
                                                                disabled={loadingRefactor}
                                                                className="btn-outline-lime"
                                                                style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
                                                            >
                                                                <Sparkles size={12} /> Refactor
                                                            </button>
                                                        </div>
                                                        {ref.explanation && (
                                                            <p style={{ color: '#666', fontSize: '0.8rem', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(170,255,0,0.08)' }}>
                                                                {ref.explanation}
                                                            </p>
                                                        )}
                                                        <CodeSnippet code={ref.snippet} language="javascript" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* Refactor Suggestions */}
                    {refactorSuggestions?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                            style={{ padding: '2rem', borderColor: 'rgba(170,255,0,0.4) !important' }}>
                            <div className="section-label" style={{ marginBottom: '1.5rem' }}>Refactor Suggestions</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {refactorSuggestions.map((s, i) => (
                                    <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{s.title}</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span style={{ background: priorityColor(s.priority), color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                                    {s.priority}
                                                </span>
                                                <span className="tag-outline">{s.category}</span>
                                            </div>
                                        </div>
                                        <p style={{ color: '#777', fontSize: '0.82rem', lineHeight: 1.6 }}>{s.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ── SIDEBAR ── */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card qa-sidebar"
                    style={{ padding: '1.5rem', alignSelf: 'start', position: 'sticky', top: '80px' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(170,255,0,0.1)' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#aaff00', boxShadow: '0 0 6px rgba(170,255,0,0.8)' }} />
                        <span className="section-label">Recent Questions</span>
                    </div>

                    {history.length === 0 ? (
                        <p style={{ color: '#444', fontSize: '0.8rem', textAlign: 'center', padding: '2rem 0' }}>No questions yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '2px' }}>
                            {history.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setCurrentAnswer({
                                        question: item.question,
                                        answer: item.answer,
                                        mermaidCode: item.mermaid_code,
                                        fileReferences: item.file_references,
                                        tags: item.tags
                                    })}
                                    className="glass-card"
                                    style={{
                                        padding: '1.1rem 1.1rem',
                                        cursor: 'pointer',
                                        width: '100%',
                                    }}
                                >
                                    {/* Icon box */}
                                    <div style={{
                                        width: '32px', height: '32px',
                                        background: 'rgba(170,255,0,0.1)',
                                        border: '2px solid rgba(170,255,0,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#aaff00',
                                        marginBottom: '0.75rem',
                                        flexShrink: 0,
                                    }}>
                                        <MessageSquare size={15} />
                                    </div>

                                    {/* Question text */}
                                    <div style={{
                                        fontWeight: 800,
                                        fontSize: '0.82rem',
                                        color: '#fff',
                                        marginBottom: '0.35rem',
                                        letterSpacing: '0.01em',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: 1.5,
                                    }}>
                                        {item.question}
                                    </div>

                                    {/* Date */}
                                    <div style={{ color: '#555', fontSize: '0.68rem', fontFamily: 'Space Mono, monospace', marginBottom: item.tags?.length > 0 ? '0.5rem' : 0 }}>
                                        {new Date(item.created_at).toLocaleDateString()}
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
            </div>
        </div>
    );
};

export default QAInterface;
