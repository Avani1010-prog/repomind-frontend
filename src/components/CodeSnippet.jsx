import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeSnippet = ({ code, language = 'javascript' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: copied ? '#aaff00' : '#2a2a2a',
                    color: copied ? '#0a0a0a' : '#888888',
                    border: '1px solid #3a3a3a',
                    padding: '0.35rem 0.6rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'all 0.15s',
                    fontFamily: 'Space Grotesk, sans-serif',
                }}
            >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
            </button>

            <pre style={{
                background: '#0d0d0d',
                border: '2px solid #2a2a2a',
                padding: '1.25rem',
                paddingTop: '3rem',
                overflowX: 'auto',
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.78rem',
                lineHeight: '1.7',
                color: '#aaff00',
                margin: 0,
            }}>
                <code>{code}</code>
            </pre>

            {/* Language badge */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                background: '#2a2a2a',
                color: '#888888',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.25rem 0.6rem',
                fontFamily: 'Space Mono, monospace',
            }}>
                {language}
            </div>
        </div>
    );
};

export default CodeSnippet;
