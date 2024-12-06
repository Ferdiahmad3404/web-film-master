import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-6">Page Not Found</p>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
                Go to Homepage
            </button>
        </div>
    );
};

export default NotFound;    