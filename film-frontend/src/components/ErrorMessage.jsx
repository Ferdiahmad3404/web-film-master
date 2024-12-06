// ErrorMessage.js
import React, { useEffect, useState } from 'react';

const ErrorMessage = ({ message }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000); 
            return () => clearTimeout(timer); // Clean up the timer when the component is unmounted
        }
    }, [message]);

    if (!visible) return null;

    return (
        <div className="mt-2 text-red-500 bg-red-100 border border-red-400 p-2 rounded">
            {message}
        </div>
    );
};

export default ErrorMessage;
