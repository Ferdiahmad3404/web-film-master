import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CMSSidebar from '../components/CMSSidebar';
import Sidenav from '../components/Sidenav';
import Footer from '../components/Footer';

const CMSDramas = () => {
    const [dramas, setDramas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('a-z');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dramasPerPage] = useState(10); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDramas = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/films`);
                const data = await response.json();
                setDramas(data.data);
            } catch (error) {
                console.error('Error fetching dramas:', error);
            }
        };

        fetchDramas();
    }, []);

    // Handle search filtering
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle sorting
    const handleSort = (e) => {
        setSortOption(e.target.value);
    };

    const filteredAndSortedDramas = () => {
        let filtered = dramas.filter(drama =>
            drama.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            drama.actors.some(actor => actor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            drama.genres.some(genre => genre.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            drama.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortOption === 'a-z') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === 'z-a') {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        }

        return filtered;
    };

    const totalPages = Math.ceil(filteredAndSortedDramas().length / dramasPerPage);
    const currentDrama = filteredAndSortedDramas().slice((currentPage - 1) * dramasPerPage, currentPage * dramasPerPage);

    const getPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 5);

        if (endPage - startPage < 5) {
            startPage = Math.max(1, endPage - 5);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle edit
    const handleEdit = (drama) => {
        navigate('/cmsdramainput', { state: { drama } });
    };

    // Handle delete
    const deleteDrama = async (id) => {
        if (window.confirm('Are you sure you want to delete this country?')) {
            try {
                const response = await fetch(`http://localhost:8000/films/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setDramas(dramas.filter(drama => drama.id !== id));
                    showMessage('Drama deleted successfully', 'success');
                } else {
                    showMessage('Failed to delete drama', 'error');
                }
            } catch (error) {
                showMessage('Error deleting drama', 'error');
            }
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <>
            <div className="bg-gray-100">
                <div className="flex">
                    <CMSSidebar />

                    {/* Main Content */}
                    <main className="flex-1 bg-gray-100 p-6">
                        <div className="w-full p-9">
                            <div className="mb-5 flex flex-col justify-between">
                                <h1 className="text-2xl mb-5 font-medium">Drama</h1>
                            </div>

                            {message && (
                                <div className={`mb-4 p-2 text-white rounded ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {message}
                                </div>
                            )}

                            {/* Search and Sort Options */}
                            <div className="flex justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="text" 
                                        className="border border-gray-400 px-4 py-2 rounded-full" 
                                        placeholder="Search drama"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>

                                <div className="flex items-center space-x-2 w-1/6">
                                    <label className="mr-2 w-full">Sort by:</label>
                                    <select 
                                        className="w-full border border-gray-400 px-4 py-2 rounded-full"
                                        value={sortOption}
                                        onChange={handleSort}
                                    >
                                        <option value="a-z">A-Z</option>
                                        <option value="z-a">Z-A</option>
                                    </select>
                                </div>
                            </div>

                            {/* Drama List */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left mb-10 text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-yellow-900 dark:text-white">
                                        <tr>
                                            <th className="w-1/12 px-4 py-4 sr-only">No</th>
                                            <th className="w-2/12 px-4 py-4">Title</th>
                                            <th className="w-2/12 px-4 py-4">Actors</th>
                                            <th className="w-2/12 px-4 py-4">Genres</th>
                                            <th className="w-3/12 px-4 py-4">Description</th>
                                            <th className="w-1/12 px-4 py-4">Status</th>
                                            <th className="w-1/12 px-4 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentDrama.map((drama, index) => (
                                            <tr className="border-b dark:border-gray-700" key={drama.id}>
                                                <td className="px-4 py-3 text-black">{(currentPage - 1) * dramasPerPage + index + 1}</td>
                                                <td className="px-4 py-3 text-black">{drama.title}</td>
                                                <td className="px-4 py-3 text-black"
                                                >
                                                    {drama.actors.map(actor => actor.name).join(', ').length > 100
                                                        ? `${drama.actors.map(actor => actor.name).join(', ').slice(0, 100)}...`
                                                        : drama.actors.map(actor => actor.name).join(', ')
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-black">{drama.genres.map(genre => genre.genre).join(', ')}</td>
                                                <td className="px-4 py-3 text-black"
                                                >
                                                    {drama.description.length > 50 ? `${drama.description.slice(0, 150)}...` : drama.description}
                                                </td>
                                                <td className={`px-4 py-3 ${drama.status === "approved" ? "text-green-500" : drama.status === "pending" ? "text-blue-500" : "text-red-500"}`}
                                                >
                                                    {drama.status}
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex justify-center items-center">
                                                        <button 
                                                            onClick={() => handleEdit(drama)} 
                                                            className="flex py-2 px-4 hover:text-blue-600 text-black"
                                                        >
                                                            Edit
                                                        </button>
                                                        <span className="text-black">|</span>
                                                        <button 
                                                            onClick={() => deleteDrama(drama.id)} 
                                                            className="flex items-center py-2 px-4 hover:text-red-600 text-black"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination Section */}
                                <div className="flex justify-center mt-4">
                                    <div className="flex items-center">
                                        {currentPage > 1 && (
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                className="mx-1 px-3 py-1 rounded bg-white text-blue-500 border"
                                            >
                                                Prev
                                            </button>
                                        )}
                                        {getPageNumbers().map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        {currentPage < totalPages && (
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                className="mx-1 px-3 py-1 rounded bg-white text-blue-500 border"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    
                    <Sidenav />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CMSDramas;
