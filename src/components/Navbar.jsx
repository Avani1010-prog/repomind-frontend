import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, History, ChevronLeft, ChevronRight, FolderOpen, Brain } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const links = [
        { to: '/', label: 'Home', icon: <Home size={20} /> },
        { to: '/status', label: 'Status', icon: <Activity size={20} /> },
        { to: '/history', label: 'History', icon: <History size={20} /> },
    ];

    return (
        <nav className={`sidebar-nav ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <Link to="/" className="nav-logo" style={{ textDecoration: 'none', marginBottom: '3rem', display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(170,255,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        flexShrink: 0,
                        position: 'relative'
                    }}>
                        <FolderOpen size={24} color="#aaff00" strokeWidth={2.5} />
                        <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Brain size={12} color="#aaff00" strokeWidth={3} />
                        </div>
                    </div>
                    {!isCollapsed && (
                        <span style={{
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            opacity: 1,
                            transition: 'opacity 0.2s',
                            overflow: 'hidden'
                        }}>
                            RepoMind
                        </span>
                    )}
                </div>
            </Link>

            {/* Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map(link => {
                    const isActive = location.pathname === link.to;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            title={isCollapsed ? link.label : ''}
                            className="nav-link"
                            style={{
                                textDecoration: 'none',
                                padding: '0.75rem 0', // Vertical padding only, horizontal handled by flex
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                paddingLeft: isCollapsed ? 0 : '1rem',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: isActive ? '#0a0a0a' : '#888888',
                                background: isActive ? '#aaff00' : 'transparent',
                                border: '1px solid',
                                borderColor: isActive ? '#aaff00' : 'transparent',
                                borderRadius: '8px',
                                transition: 'all 0.15s',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.color = '#aaff00';
                                    e.currentTarget.style.borderColor = '#2a2a2a';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.color = '#888888';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '24px' }}>
                                {link.icon}
                            </span>
                            {!isCollapsed && (
                                <span style={{ marginLeft: '0.75rem' }}>{link.label}</span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Toggle & Footer */}
            <div className="nav-footer" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'flex-start', gap: '1rem' }}>
                <button
                    className="nav-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'color 0.2s',
                        width: '100%'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#aaff00'}
                    onMouseLeave={e => e.currentTarget.style.color = '#666'}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                            <ChevronLeft size={20} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Collapse</span>
                        </div>
                    )}
                </button>

                {!isCollapsed && (
                    <div style={{ color: '#444', fontSize: '0.7rem', fontFamily: 'Space Mono, monospace' }}>v1.0.0</div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
