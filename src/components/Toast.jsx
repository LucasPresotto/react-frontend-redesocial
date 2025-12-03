import { useEffect } from "react";

const Toast = ({ message, type = "danger", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1055 }}>
            <div className={`toast show align-items-center text-bg-${type} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {message}
                    </div>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white me-2 m-auto" 
                        onClick={onClose} 
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default Toast;