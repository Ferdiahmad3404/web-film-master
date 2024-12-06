import React, { useEffect, useState } from 'react';
import CMSSidebar from '../components/CMSSidebar';
import Sidenav from '../components/Sidenav';
import Footer from '../components/Footer';
import axios from 'axios';

const CMSAwards = () => {
    const [awards, setAwards] = useState([]);
    const [countries, setCountries] = useState([]);
    const [newCountry, setNewCountry] = useState('');
    const [newYear, setNewYear] = useState('');
    const [newAwards, setNewAwards] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('a-z');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [tempName, setTempName] = useState('');
    const [tempYear, setTempYear] = useState('');

    useEffect(() => {
        fetchAwards();
        fetchCountries();
    }, []);

    useEffect(() => {
        if (statusMessage) {
            const timer = setTimeout(() => {
                setStatusMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    const fetchAwards = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/awards`);
            const data = await response.json();
            setAwards(data);
        } catch (error) {
            setStatusMessage(`Failed to fetch awards: ${error.message}`);
            setStatusType('error');
        }
    };
    
    const fetchCountries = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/countries`);
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            setStatusMessage('Failed to fetch countries.');
            setStatusType('error');
        }
    };

    const filteredAwards = () => {
        return awards.filter(item =>
            item.country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.year.toString().includes(searchQuery) ||
            item.award.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => {
            return sortOrder === 'a-z' ?
                a.country.country.localeCompare(b.country.country) :
                b.country.country.localeCompare(a.country.country);
        });
    };

    const paginatedAwards = () => {
        const filtered = filteredAwards();
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filtered.slice(startIndex, startIndex + itemsPerPage);
    };

    const renderAwards = () => {
        return paginatedAwards().map((item, index) => (
            <tr key={item.id} className="border-b">
                <th scope="row" className="px-4 py-3 font-medium text-black">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                <td className="px-4 py-3 font-medium text-black">{item.country.country}</td>
                <td className="px-4 py-3 font-medium text-black">
                    {editingId === item.id ? (
                        <input
                            type="text"
                            value={tempYear}
                            onChange={handleChange}
                            onBlur={() => handleSave(item.id)}
                            onKeyDown={(e) => handleKeyDown(e, item.id)}
                            className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                            autoFocus
                        />
                    ) : (
                        item.year
                    )}    
                </td>
                <td className="px-4 py-3 font-medium text-black">
                    {editingId === item.id ? (
                        <input
                            type="text"
                            value={tempName}
                            onChange={handleChange}
                            onBlur={() => handleSave(item.id)}
                            onKeyDown={(e) => handleKeyDown(e, item.id)}
                            className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                            autoFocus
                        />
                    ) : (
                        item.award
                    )}
                </td>
                <td className="text-center text-black">
                    <div className="flex justify-center items-center">
                        {editingId === item.id ? (
                            <>
                                <button onClick={() => handleDoubleClick()} className="flex py-2 px-4 text-black hover:text-blue-600">
                                    Save
                                </button>
                                <span className="text-black">|</span>
                                <button onClick={() => handleCancelClick()} className="flex py-2 px-4 text-black hover:text-red-600">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button onClick={() => handleDoubleClick(item)} className="flex py-2 px-4 text-black hover:text-blue-600">
                                Edit
                            </button>
                        )}
                        <span className="text-black">|</span>
                        <button onClick={() => deleteActors(item.id)} className="flex py-2 px-4 text-black hover:text-red-600">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    const addAwards = async (e) => {
        e.preventDefault();
        if (newCountry && newYear && newAwards) {
            try {
                const response = await fetch('http://localhost:8000/awards', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ country_id: newCountry, year: newYear, award: newAwards }),
                });

                const data = await response.json();
                setAwards(prev => [...prev, data.data]);
                resetForm();
                setStatusMessage('Award added successfully.');
                setStatusType('success');
            } catch (error) {
                setStatusMessage('Failed to add award.');
                setStatusType('error');
            }
        }
    };

    const deleteAwards = async (id) => {
        if (window.confirm('Are you sure you want to delete this award?')) {
            try {
                await axios.delete(`http://localhost:8000/awards/${id}`);
                setAwards(awards.filter(a => a.id !== id));
                setStatusMessage('Award deleted successfully.');
                setStatusType('success');
            } catch (error) {
                setStatusMessage('Failed to delete award.');
                setStatusType('error');
            }
        }
    };

    const handleDoubleClick = (award) => {
        setEditingId(award.id);
        setTempName(award.award); // Isi input dengan nama saat ini
        setTempYear(award.year);
    };

    const handleChange = (e) => {
        setTempName(e.target.value); // Update nama saat mengetik
        setTempYear(e.target.value);
    };

    const handleCancelClick = () => {
        setEditingId(null); 
        setTempName(null);
        setTempYear(null);
    };

    const handleSave = (id) => {
        if (tempName.trim() && tempYear.trim()) {
            updateAward(id, tempName.trim(), tempYear.trim()); // Simpan perubahan
        }
        setEditingId(null); // Keluar dari mode edit
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleSave(id); // Simpan perubahan jika tekan Enter
        }
    };


    const resetForm = () => {
        setNewCountry('');
        setNewYear('');
        setNewAwards('');
    };

    const totalPages = () => {
        return Math.ceil(filteredAwards().length / itemsPerPage);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className="bg-grey-100">
                <div className="flex">
                    <CMSSidebar />
                    <main className="flex-1">
                        <div className="p-5">
                            <h2 className="text-2xl font-bold mb-4">Manage Awards</h2>
                            {statusMessage && (
                                <div className={`alert ${statusType === 'success' ? 'alert-success' : 'alert-error'}`}>
                                    {statusMessage}
                                </div>
                            )}
                            <form onSubmit={addAwards} className="mb-5 space-y-4">
                                <div className="relative z-0 w-full mb-5 group">
                                    <select
                                        id="country_id"
                                        name="country_id"
                                        value={newCountry}
                                        onChange={(e) => setNewCountry(e.target.value)}
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        required        
                                    >
                                        <option value="" disabled hidden>Select a country</option>
                                        {countries.sort((a, b) => a.country.localeCompare(b.country)).map((country) => (
                                            <option key={country.id} value={country.id} className="text-black">
                                                {country.country}
                                            </option>
                                        ))}
                                    </select>
                                    <label 
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Country
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        id="year"
                                        name="year"
                                        value={newYear}
                                        onChange={(e) => setNewYear(e.target.value)}
                                        required
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" "
                                    />
                                    <label 
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Year
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        id="award"
                                        name="award"
                                        value={newYear}
                                        onChange={(e) => setNewYear(e.target.value)}
                                        required
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" "
                                    />
                                    <label 
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Award
                                    </label>
                                </div>
                                <div className="w-full flex items-center mb-5">
                                    <button type="submit" className="w-full h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600">Add New Award</button>
                                </div>
                            </form>
                            <div className="relative flex flex-col mt-4">
                                <div className="flex justify-between mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        value={searchQuery} 
                                        onChange={e => setSearchQuery(e.target.value)} 
                                        className="border border-gray-400 px-4 py-2 rounded-full"
                                    />
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="border border-gray-400 px-4 py-2 rounded-full"
                                    >
                                        <option value="a-z">A-Z</option>
                                        <option value="z-a">Z-A</option>
                                    </select>
                                </div>
                            </div>
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-white uppercase bg-yellow-900">
                                    <tr>
                                        <th className="px-4 py-4">#</th>
                                        <th className="px-4 py-4">Country</th>
                                        <th className="px-4 py-4">Year</th>
                                        <th className="px-4 py-4">Award</th>
                                        <th className="px-4 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderAwards()}
                                </tbody>
                            </table>
                            <div className="mt-4 flex justify-center space-x-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages()).keys()].map((page) => (
                                    <button
                                        key={page + 1}
                                        onClick={() => handlePageChange(page + 1)}
                                        className={`px-4 py-2 rounded ${currentPage === page + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={currentPage === totalPages()}
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
        </>
    );
};

export default CMSAwards;
