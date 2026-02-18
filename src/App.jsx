import { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Home from './pages/Home';
import QAInterface from './pages/QAInterface';
import Status from './pages/Status';
import History from './pages/History';
function App() {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    return (
        <Router>
            {/* App content */}
            <div className="app-layout" style={{ position: 'relative', zIndex: 1 }}>
                <Navbar />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Routes>
                        <Route path="/" element={<Home showToast={showToast} />} />
                        <Route path="/qa/:codebaseId" element={<QAInterface showToast={showToast} />} />
                        <Route path="/status" element={<Status />} />
                        <Route path="/history" element={<History showToast={showToast} />} />
                    </Routes>
                </div>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </div>
        </Router>
    );
}

export default App;
