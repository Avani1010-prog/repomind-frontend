import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import { motion } from 'framer-motion';

const Mermaid = ({ chart }) => {
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'Space Mono',
            themeVariables: {
                primaryColor: '#aaff00',
                primaryTextColor: '#000',
                primaryBorderColor: '#aaff00',
                lineColor: '#aaff00',
                secondaryColor: '#1a1a1a',
                tertiaryColor: '#111',
            }
        });
    }, []);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!chart) return;

            try {
                const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(uniqueId, chart);
                setSvg(svg);
                setError(null);
            } catch (err) {
                console.error('Mermaid render error:', err);
                // Don't show error to user, just don't render or show fallback
                setError(err);
            }
        };

        renderDiagram();
    }, [chart]);

    if (!chart || error) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                overflowX: 'auto',
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid rgba(170,255,0,0.1)'
            }}
        >
            <div dangerouslySetInnerHTML={{ __html: svg }} />
        </motion.div>
    );
};

export default Mermaid;
