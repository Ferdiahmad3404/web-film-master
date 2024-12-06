import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CMSSidebar from '../components/CMSSidebar';
import Sidenav from '../components/Sidenav';
import Footer from '../components/Footer';
import CountryList from '../components/CountryList';
import ErrorMessage from '../components/ErrorMessage';

const CMSCountries = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [newCountry, setNewCountry] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('a-z');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(null);
    const [newlyAddedCountry, setNewlyAddedCountry] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/countries`);
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            setError('Failed to fetch countries.');
            console.error('Error fetching countries:', error);
        }
    };

    const addCountry = async () => {
        if (newCountry.trim()) {
            try {
                const requestData = { country: newCountry.trim() };

                const response = await fetch(`${import.meta.env.VITE_API_URL}/countries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });
                console.log(response);
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to add country.');
                }

                setNewlyAddedCountry(data.data);
                setNewCountry('');
                showMessage('Country added successfully!', 'success');
                setError(null);
            } catch (error) {
                setError(error.message);
                console.error('Error adding country:', error);
            }
        }
    };

    const updateCountry = async (id, newName) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/countries/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: newName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error updating country!');
            }

            showMessage('Country updated successfully!', 'success');
            setError(null);
        } catch (error) {
            setError(error.message);
            console.error('Error updating country:', error);
        }
    };

    const deleteCountry = async (id) => {
        if (window.confirm('Are you sure you want to delete this country?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/countries/${id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error deleting country!');
                }

                setCountries(countries.filter((country) => country.id !== id));
                showMessage('Country deleted successfully!', 'success');
                setError(null);
                navigate('/cmscountries');
            } catch (error) {
                setError(error.message);
                console.error('Error deleting country:', error);
            }
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    const getFilteredAndSortedCountries = () => {
        fetchCountries();
        const filteredCountries = countries.filter((country) =>
            country.country && country.country.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const sortedCountries = [...filteredCountries];
        if (sortOption === 'a-z') {
            sortedCountries.sort((a, b) => a.country.localeCompare(b.country));
        } else if (sortOption === 'z-a') {
            sortedCountries.sort((a, b) => b.country.localeCompare(a.country));
        }

        return newlyAddedCountry ? [newlyAddedCountry, ...sortedCountries] : sortedCountries;
    };

    // Pagination Logic
    const indexOfLastCountry = currentPage * itemsPerPage;
    const indexOfFirstCountry = indexOfLastCountry - itemsPerPage;
    const currentCountries = getFilteredAndSortedCountries().slice(indexOfFirstCountry, indexOfLastCountry);
    const totalPages = Math.ceil(getFilteredAndSortedCountries().length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-gray-100">
            <div className="flex">
                <CMSSidebar />
                <main className="flex-1 bg-gray-100 p-6">
                    <div className="w-full p-9">
                        <h1 className="text-2xl mb-5 font-medium">Add New Countries</h1>

                        {message && (
                            <div
                                className={`mb-4 p-2 text-white rounded ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                            >
                                {message}
                            </div>
                        )}

                        <form className="flex flex-col mb-10" onSubmit={(e) => { e.preventDefault(); addCountry(); }}>
                            <div className="relative z-0 w-full mb-4 group">
                                <input
                                    type="text"
                                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={newCountry}
                                    onChange={(e) => setNewCountry(e.target.value)}
                                    required
                                />
                                <label className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                    Country Name
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

                        <CountryList
                            countries={currentCountries}
                            updateCountry={updateCountry}
                            deleteCountry={deleteCountry}
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

export default CMSCountries;