import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const CommentsSection = ({ id }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [replyComment, setReplyComment] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [replySuccess, setReplySuccess] = useState(false);
    const [commentSuccess, setCommentSuccess] = useState(false); // New state for comment success message
    const isLoggedIn = sessionStorage.getItem('role_id') === 'user' || sessionStorage.getItem('role_id') === 'admin';

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/films/${id}/comments`);
            const data = await response.json();

            if (Array.isArray(data)) {
                setComments(data);
            } else {
                console.error('Data is not an array:', data);
                setComments([]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]); // Ensure comments is empty if there's an error
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleReplyChange = (e) => {
        setReplyComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const userId = sessionStorage.getItem('id'); 
        const token = sessionStorage.getItem('token');
        if (newComment.trim()) {
            try {
                const response = await fetch(`http://localhost:8000/films/${id}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        comment: newComment
                    }),
                });

                // Reset the new comment input and show success message
                setNewComment('');
                setCommentSuccess(true);

                // Hide the success message after 2 seconds
                setTimeout(() => setCommentSuccess(false), 2000);
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        if (replyComment.trim()) {
            try {
                const userId = sessionStorage.getItem('id');
                const token = sessionStorage.getItem('token');
                const response = await fetch(`http://localhost:8000/films/${id}/comments/${commentId}/reply`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ 
                        userId: userId,
                        comment: replyComment
                    }),
                });
                
                if (!response.ok) {
                    throw new Error('Failed to submit reply');
                }

                setReplySuccess(true);
                setReplyComment('');

                setTimeout(() => setReplySuccess(false), 2000);

            } catch (error) {
                console.error('Error submitting reply:', error);
            }
        }
    };

    const handleStarClick = (rating) => {
        setNewRating(rating);
    };

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <FaStar
                    key={ratingValue}
                    size={30}
                    color={ratingValue <= newRating ? '#ffc107' : '#e4e5e9'}
                    onClick={() => handleStarClick(ratingValue)}
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                />
            );
        });
    };

    return (
        <div className="mt-8 bg-yellow-1000">
            <h2 className="text-2xl font-semibold mb-4">Komentar</h2>

            <div className="mb-4">
                <h3 className="font-semibold">Average Rating: {comments.length > 0 
                    ? (comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length).toFixed(1) 
                    : 'N/A'} ★</h3>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-4 border p-4 rounded-lg shadow-md bg-white">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="border-b p-4">
                            <h4 className="font-bold">{comment.user.username}</h4>
                            <p className="mt-2">{comment.comment}</p>
                            <button
                                onClick={() => setReplyToCommentId(comment.id === replyToCommentId ? null : comment.id)}
                                className="mt-2 text-blue-500 hover:underline"
                            >
                                Reply
                            </button>

                            {replyToCommentId === comment.id && (
                                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-2">
                                    <textarea
                                        value={replyComment}
                                        onChange={handleReplyChange}
                                        placeholder="Tulis balasan Anda..."
                                        className="border rounded p-2 w-full h-24"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                                    >
                                        Kirim Balasan
                                    </button>
                                    {replySuccess && (
                                        <p className="text-green-600 mt-2">Balasan terkirim! Menunggu Persetujuan Admin</p>
                                    )}
                                </form>
                            )}

                            {comment.replies && comment.replies.map((reply, replyIndex) => (
                                <div key={replyIndex} className="ml-4 mt-2 p-2 bg-gray-400 rounded">
                                    <h5 className="font-semibold">{reply.user.username}</h5>
                                    <p>{reply.comment}</p>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Belum ada komentar.</p>
                )}
            </div>

            {isLoggedIn ? (
                <>
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Beri Rating</h3>
                        <div className="flex">
                            {renderStars()}
                        </div>
                        <button
                            onClick={() => { if (newRating) alert(`Rating ${newRating} diberikan!`); }}
                            className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
                        >
                            Submit Rating
                        </button>
                    </div>

                    <form onSubmit={handleCommentSubmit} className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Tinggalkan Komentar</h3>
                        <div className="mt-2">
                            <textarea
                                value={newComment}
                                onChange={handleCommentChange}
                                placeholder="Tulis komentar Anda..."
                                className="border rounded p-2 w-full h-24"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                        >
                            Kirim Komentar
                        </button>
                        {commentSuccess && (
                            <p className="text-green-600 mt-2">Komentar berhasil ditambahkan! Menunggu Persetujuan Admin</p> // Success message
                        )}
                    </form>
                </>
            ) : (
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-600">Anda harus <a href="/login" className="text-blue-500 hover:underline">Login</a> atau <a href="/signup" className="text-blue-500 hover:underline">Daftar</a> untuk menambahkan komentar.</p>
                </div>
            )}
        </div>
    );
};

export default CommentsSection;
