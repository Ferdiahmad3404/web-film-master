import React, { useState, useEffect } from 'react';
import CMSSidebar from '../components/CMSSidebar';
import Sidenav from '../components/Sidenav';
import Footer from '../components/Footer';

const CMSUsers = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(null);
    const [suspendDurations, setSuspendDurations] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users`);
            const data = await response.json();
            setUsers(data);
            console.log(data);
        } catch (error) {
            setError('Failed to fetch users.');
        }
    };

    const suspendUser = async (userId) => {
        const duration = suspendDurations[userId];
        if (!duration) {
            alert('Please select a suspension duration');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/suspend/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ duration }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to suspend user.');
            }

            setMessage('User suspended successfully!');
            setMessageType('success');
            fetchUsers(); // Refresh the user list
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSuspendDurationChange = (userId, duration) => {
        setSuspendDurations(prevDurations => ({
            ...prevDurations,
            [userId]: duration,
        }));
    };

    const calculateSuspensionStatus = (suspensionEnd) => {
        if (!suspensionEnd) return 'Active';

        const now = new Date();
        const end = new Date(suspensionEnd);
        const timeRemaining = end - now;

        if (timeRemaining <= 0) return 'Active';

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        return  `${hours}h ${minutes}m remaining`;
    };

    // Pagination logic
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-gray-100">
            <div className="flex">
                <CMSSidebar />
                <main className="flex-1 bg-gray-100 p-6">
                    <div className="w-full p-9">
                        <h1 className="text-2xl mb-5 font-medium">Manage Users</h1>

                        {message && (
                            <div
                                className={`mb-4 p-2 text-white rounded ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                            >
                                {message}
                            </div>
                        )}

                        {/* Users List */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left mb-10 text-gray-500">
                                <thead className="text-xs uppercase bg-yellow-800 text-white">
                                    <tr>
                                        <th scope="col" className="px-4 py-4">Name</th>
                                        <th scope="col" className="px-4 py-4">Email</th>
                                        <th scope="col" className="px-4 py-4">Role</th>
                                        <th scope="col" className="px-4 py-4">Suspension Status</th>
                                        <th scope="col" className="px-4 py-4">Action</th>
                                        <th scope="col" className="px-4 py-4">Suspension Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map(user => (
                                        <tr key={user.id} className="border-b text-black">
                                            <td className="px-4 py-3">{user.username}</td>
                                            <td className="px-4 py-3">{user.email}</td>
                                            <td className="px-4 py-3">{user.role_id}</td>
                                            <td className="px-4 py-3">
                                                {calculateSuspensionStatus(user.suspended_until)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => suspendUser(user.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                                >
                                                    Suspend
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    className="border p-1 rounded"
                                                    onChange={(e) => handleSuspendDurationChange(user.id, e.target.value)}
                                                >
                                                    <option value="null">-</option>
                                                    <option value="1m">1 Minutes</option>
                                                    <option value="1h">1 Hour</option>
                                                    <option value="1d">1 Day</option>
                                                    <option value="7d">1 Week</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        <div className="mt-4 flex justify-center space-x-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages).keys()].map((page) => (
                                <button
                                    key={page + 1}
                                    onClick={() => handlePageChange(page + 1)}
                                    className={`px-4 py-2 rounded ${currentPage === page + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                >
                                    {page + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </main>
                <Sidenav />
            </div>
            <Footer />
        </div>
    );
};

export default CMSUsers;
