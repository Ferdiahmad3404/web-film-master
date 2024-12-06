import React, { useState, useEffect } from 'react';
import CMSSidebar from '../components/CMSSidebar';
import Sidenav from '../components/Sidenav';
import Footer from '../components/Footer';

const CMSComments = () => {
    const [comments, setComments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/CMScomments`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            setError('Failed to fetch comments.');
        }
    };

    const updateCommentStatus = async (id, status) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === id ? { ...comment, status } : comment
                )
            );
            showMessage(`Comment ${status} successfully!`, 'success');
            console.log('comment :', status);
        } catch (error) {
            setError('Failed to update comment status.');
            console.log('Failed to update comment status.', error);
            showMessage(`Comment ${status} failed!`, 'error');
        }
    };

    const getFilteredAndSearchedComments = () => {
        let filteredComments = comments;

        // Filter by status
        if (filterOption !== 'all') {
            filteredComments = filteredComments.filter(
                (comment) => comment.status === filterOption
            );
        }

        // Search by film
        return filteredComments.filter((comment) =>
            comment.film.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    const indexOfLastComment = currentPage * itemsPerPage;
    const indexOfFirstComment = indexOfLastComment - itemsPerPage;
    const currentComments = getFilteredAndSearchedComments().slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(getFilteredAndSearchedComments().length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const [editingCommentId, setEditingCommentId] = useState(null);

    const handleEditClick = (id) => {
        // Toggle the comment's edit state
        setEditingCommentId(editingCommentId === id ? null : id);
    };

    return (
        <div className="bg-gray-100">
            <div className="flex">
                <CMSSidebar />
                <main className="flex-1 bg-gray-100 p-6">
                    <div className="w-full p-9">
                        <h1 className="text-2xl mb-5 font-medium">Manage Comments</h1>

                        {message && (
                            <div className={`mb-4 p-2 text-white rounded ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {message}
                            </div>
                        )}

                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                className="border border-gray-400 px-4 py-2 rounded-full"
                                placeholder="Search by film"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                value={filterOption}
                                onChange={(e) => setFilterOption(e.target.value)}
                                className="border border-gray-400 px-4 py-2 rounded-full"
                            >
                                <option value="all">All</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="unapproved">Unapproved</option>
                            </select>
                        </div>

                        {/* Comments List */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left mb-10 text-gray-500">
                                <thead className="text-xs uppercase bg-yellow-800 text-white">
                                    <tr>
                                        <th scope="col" className="px-4 py-4">Username</th>
                                        <th scope="col" className="px-4 py-4">Comment</th>
                                        <th scope="col" className="px-4 py-4">Film</th>
                                        <th scope="col" className="px-4 py-4">Status</th>
                                        <th scope="col" className="px-4 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentComments.map((comment) => (
                                        <tr key={comment.id} className="border-b text-black">
                                            <td className="px-4 py-3">{comment.user?.username}</td>
                                            <td className="px-4 py-3">{comment.comment}</td>
                                            <td className="px-4 py-3">{comment.film.title}</td>
                                            <td>
                                                <span
                                                    className={`px-3 py-1 rounded ${
                                                        comment.status === 'approved'
                                                            ? 'bg-green-200 text-green-800'
                                                            : comment.status === 'pending' 
                                                            ? 'bg-blue-400 text-white'
                                                            : 'bg-red-200 text-red-800'
                                                    }`}
                                                >
                                                    {comment.status}
                                                </span>
                                            </td>
                                            <td className="flex items-center justify-center">
                                                <div className="comment-content">
                                                    
                                                </div>
                                                {editingCommentId !== comment.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(comment.id)}
                                                            className="px-3 py-1 text-black hover:text-blue-500 rounded"
                                                        >
                                                            Change
                                                        </button>
                                                    </>
                                                ) : ( 
                                                    <div className="flex flex-col items-center justify-center">
                                                        <button
                                                            onClick={() => handleEditClick(comment.id)}
                                                            className="px-3 py-1 text-red-500 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <div className="flex space-x-2 mt-2">
                                                            {comment.status === 'pending' ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => updateCommentStatus(comment.id, 'approved')}
                                                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateCommentStatus(comment.id, 'unapproved')}
                                                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                                                    >
                                                                        Unapprove
                                                                    </button>
                                                                </>
                                                            ) : comment.status === 'approved' ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => updateCommentStatus(comment.id, 'pending')}
                                                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                                                    >
                                                                        Pending
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateCommentStatus(comment.id, 'unapproved')}
                                                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                                                    >
                                                                        Unapprove
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => updateCommentStatus(comment.id, 'approved')}
                                                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateCommentStatus(comment.id, 'pending')}
                                                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                                                    >
                                                                        Pending
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
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
                                    className={`px-4 py-2 rounded ${
                                        currentPage === page + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                    }`}
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

export default CMSComments;
