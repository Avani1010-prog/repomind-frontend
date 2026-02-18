import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`toast toast-${type}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
                {type === 'success'
                    ? <CheckCircle size={16} />
                    : <XCircle size={16} />
                }
                {message}
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;
