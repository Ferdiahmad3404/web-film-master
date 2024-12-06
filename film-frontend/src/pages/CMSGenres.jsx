import React, { useState, useEffect } from 'react';
import CMSSidebar from '../components/CMSSidebar';
import Sidenav from '../components/Sidenav';
import Footer from '../components/Footer';
import GenresList from '../components/GenreList'; // Import GenresList component
import ErrorMessage from '../components/ErrorMessage'; // Import ErrorMessage component

const CMSGenres = () => {
    const [genres, setGenres] = useState([]);
    const [newGenre, setNewGenre] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('a-z');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(null);
    const [newlyAddedGenre, setNewlyAddedGenre] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/genres`);
            const data = await response.json();
            setGenres(data);
        } catch (error) {
            setError('Failed to fetch genres.');
            console.error('Error fetching genres:', error);
        }
    };

    const addGenre = async () => {
        if (newGenre.trim()) {
            try {
                const requestData = { genre: newGenre.trim() };

                const response = await fetch(`${import.meta.env.VITE_API_URL}/genres`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });
                console.log(response);
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to add genre.');
                }

                setNewlyAddedGenre(data.data);
                setNewGenre('');
                showMessage('Genre added successfully!', 'success');
                setError(null);
            } catch (error) {
                setError(error.message);
                console.error('Error adding genre:', error);
            }
        }
    };

    const updateGenre = async (id, newName) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/genres/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ genre: newName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error updating genre!');
            }

            setGenres(genres.map((c) => (c.id === id ? { ...c, genre: newName } : c)));
            showMessage('Genre updated successfully!', 'success');
            setError(null);
        } catch (error) {
            setError(error.message);
            console.error('Error updating genre:', error);
        }
    };

    const deleteGenre = async (id) => {
        if (window.confirm('Are you sure you want to delete this genre?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/genres/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error deleting genre!');
                }

                setGenres(genres.filter((genre) => genre.id !== id));
                showMessage('Genre deleted successfully!', 'success');
                setError(null);
            } catch (error) {
                setError(error.message);
                console.error('Error deleting genre:', error);
            }
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    const getFilteredAndSortedGenres = () => {
        const filteredGenres = genres.filter((genre) =>
            genre.genre && genre.genre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const sortedGenres = [...filteredGenres];
        if (sortOption === 'a-z') {
            sortedGenres.sort((a, b) => a.genre.localeCompare(b.genre));
        } else if (sortOption === 'z-a') {
            sortedGenres.sort((a, b) => b.genre.localeCompare(a.genre));
        }

        return newlyAddedGenre ? [newlyAddedGenre, ...sortedGenres] : sortedGenres;
    };

    // Pagination logic
    const indexOfLastGenre = currentPage * itemsPerPage;
    const indexOfFirstGenre = indexOfLastGenre - itemsPerPage;
    const currentGenres = getFilteredAndSortedGenres().slice(indexOfFirstGenre, indexOfLastGenre);
    
    const totalPages =  Math.ceil(getFilteredAndSortedGenres().length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-gray-100">
            <div className="flex">
                <CMSSidebar />
                <main className="flex-1 bg-gray-100 p-6">
                    <div className="w-full p-9">
                        <h1 className="text-2xl mb-5 font-medium">Add New Genres</h1>

                        {message && (
                            <div
                                className={`mb-4 p-2 text-white rounded ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                            >
                                {message}
                            </div>
                        )}

                        <form className="flex flex-col mb-10" onSubmit={(e) => { e.preventDefault(); addGenre(); }}>
                            <div className="relative z-0 w-full mb-4 group">
                                <input
                                    type="text"
                                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={newGenre}
                                    onChange={(e) => setNewGenre(e.target.value)}
                                    required
                                />
                                <label className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                    Genre Name
                                </label>
                            </div>
                            <button type="submit" className="w-full h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600">Add</button>
                        </form>

                        {/* Error message display for addCountry */}
                        <ErrorMessage message={error} />

                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                className="border border-gray-400 px-4 py-2 rounded-full"
                                placeholder="Search country"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="border border-gray-400 px-4 py-2 rounded-full"
                            >
                                <option value="a-z">A-Z</option>
                                <option value="z-a">Z-A</option>
                            </select>
                        </div>

                        <GenresList
                            genres={currentGenres}
                            updateGenre={updateGenre}
                            deleteGenre={deleteGenre}
                        />

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

export default CMSGenres;