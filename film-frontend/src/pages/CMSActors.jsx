import React, { useState, useEffect } from 'react'; 
import CMSSidebar from '../components/CMSSidebar';
import ActorList from '../components/ActorList'; 

const CMSActors = () => {
    const [actors, setActors] = useState([]);
    const [tempActors, setTempActors] = useState(null);
    const [editingActorId, setEditingActorId] = useState(null);
    const [countries, setCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('a-z');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [actorsPerPage] = useState(10); 
    const [posterPreview, setPosterPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [newlyAddedActor, setNewlyAddedActor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        url_photos: '',
        country_id: '',
        birth_date: '',
    });

    useEffect(() => {
        fetchActors();
        fetchCountries();
        getFilteredAndSortedActors();
    });

    const fetchActors = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/actors`); 
            const data = await response.json();
            if (data.success) {
                setActors(data.data);
            }
        } catch (error) {
            console.error('Error fetching actors:', error);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/countries`); 
            const data = await response.json();
            if (Array.isArray(data)) {
                setCountries(data);
            } else {
                console.error('Unexpected data format:', data);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const BASE_URL = `${import.meta.env.VITE_API_URL}/storage/`;

    // Fungsi untuk mendapatkan URL gambar yang benar
    const getImageUrl = (url) => {
        return url.startsWith('http') ? url : BASE_URL + url; // Menggunakan BASE_URL jika bukan URL lengkap
    };

    useEffect(() => {
        if (tempActors){
            setTempActors(tempActors);
            setEditingActorId(tempActors.id);
            const posterUrl = getImageUrl(tempActors.url_photos);
            
            setFormData({
                name: tempActors.name,
                birth_date: tempActors.birth_date,
                country_id: tempActors.country_id,
            });

            if (posterUrl.startsWith('http')) {
                setFile(posterUrl); 
                setPosterPreview(posterUrl); 
            } else {
                setFile(null); 
                setPosterPreview(posterUrl);
            }
        } else {
            setEditingActorId(null);
            setPosterPreview(null);
            setFile(null);
            setFormData({
                name: '',
                birth_date: '',
                country_id: '',
            });
        }
    }, [tempActors]);

    const handleSubmit = (e) => {
        if (tempActors) {
            editActors(e);
        } else {
            addActors(e);
        }
    };

    const addActors = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('country_id', formData.country_id);
        data.append('name', formData.name);
        data.append('birth_date', formData.birth_date);
        data.append('poster', file); 

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/actors`, {
                method: 'POST',
                body: data,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            console.log('Actor added successfully:', result);
            resetForm();
            fetchActors();
            showMessage('Actor added successfully!', 'success');
        } catch (error) {
            console.error('Error adding actor:', error);
            showMessage('Error adding actor!', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            url_photos: '',
            country_id: '',
            birth_date: '',
        });
        setPosterPreview(null);
        setFile(null);
    };

    const editActors = async (event) => {
        event.preventDefault();
        const data = new FormData();

        // Memastikan hanya menambahkan 'poster' jika itu adalah file
        if (file && typeof file !== 'string') {
            data.append('poster', file); // Menambahkan file poster yang baru
        } else if (file && typeof file === 'string') {
            // Jika poster adalah URL (bukan file), menambahkannya ke FormData
            data.append('url_photos', file);
        }

        data.append('name', formData.name);
        data.append('birth_date', formData.birth_date);
        data.append('country_id', formData.country_id);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/actors/${tempActors.id}`, {
                method: 'POST',
                body: data,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }

            console.log('Actor updated successfully:', result);
            showMessage('Actor updated successfully...', 'success');
            setTempActors(null);
            setEditingActorId(null);
        } catch (error) {
            console.error('Error updating actor:', error);
            showMessage('Error updating actor!', 'error');
        }
    };

    const deleteActors = async (id) => {
        if (window.confirm('Are you sure you want to delete this actor?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/actors/${id}`, { 
                    method: 'DELETE' 
                });
    
                if (response.ok) { // Jika respons dari server statusnya OK (200)
                    setActors(actors.filter(actor => actor.id !== id));
                    showMessage('Actor and poster deleted successfully!', 'success');
                } else {
                    showMessage('Error deleting actor!', 'error');
                }
            } catch (error) {
                console.error('Error deleting actor:', error);
                showMessage('Error deleting actor!', 'error');
            }
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    // const sortedActors = [...actors].sort((a, b) => {
    //     if (sortOrder === 'a-z') return a.name.localeCompare(b.name);
    //     if (sortOrder === 'z-a') return b.name.localeCompare(a.name);
    //     return 0;
    // });

    const getFilteredAndSortedActors = () => {
        // fetchActors();
        const filteredActors = actors.filter((actor) =>
            // actor.country.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
            actor.name.toLowerCase().includes(searchQuery.toLowerCase()) 
            // actor.birth_date.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const sortedActors = [...filteredActors];
        if (sortOrder === 'a-z') {
            sortedActors.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'z-a') {
            sortedActors.sort((a, b) => b.name.localeCompare(a.name));
        }

        return newlyAddedActor ? [newlyAddedActor, ...sortedActors] : sortedActors;
    };

    // const filteredActors = sortedActors.filter(item =>
    //     item.country.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
    //     item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     item.birth_date.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const totalPages = Math.ceil(getFilteredAndSortedActors().length / actorsPerPage);
    const currentActors = getFilteredAndSortedActors().slice((currentPage - 1) * actorsPerPage, currentPage * actorsPerPage);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePosterChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                setPosterPreview(e.target.result); 
                setFile(selectedFile);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleChangePoster = () => {
        setPosterPreview(null);
        setFile(null);
    };

    return (
        <div className="bg-gray-100">
            <div className="flex">
                <CMSSidebar />
                <main className="flex-1 bg-gray-100 p-6">
                    <div className="w-full p-9">
                        <div className="mb-5 flex flex-col justify-between">
                            <h1 className="text-2xl mb-5 font-medium">{tempActors ? 'Update Actor' : 'Add New Actor'}</h1>
                            <form onSubmit={handleSubmit} className="flex">
                                <div className="flex w-full">
                                    <div className="flex-col w-4/6 justify-between">
                                        <div className="relative z-0 w-5/6 mb-5 group">
                                            <select
                                                id="country_id"
                                                name="country_id"
                                                value={formData.country_id}
                                                onChange={handleInputChange}
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                required
                                            >
                                                <option value="" disabled hidden>Select country</option>
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
                                        <div className="relative z-0 w-5/6 mb-5 group">
                                            <input 
                                                type="text" 
                                                id="name"
                                                name="name"
                                                value={formData.name} 
                                                onChange={handleInputChange} 
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=" "
                                                required
                                            />
                                            <label 
                                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                            >
                                                Actor Name
                                            </label>
                                        </div>
                                        <div className="relative z-0 w-5/6 mb-5 group">
                                            <input 
                                                type="date" 
                                                id="birth_date"
                                                name="birth_date"
                                                value={formData.birth_date} 
                                                onChange={handleInputChange} 
                                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                                placeholder=" "
                                                required
                                            />
                                            <label 
                                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                            >
                                                Birth Date
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex-col w-2/6 space-y-2 justify-between">
                                        {posterPreview && (
                                            <button
                                                onClick={handleChangePoster}
                                                className="w-full items-center justify-center px-2 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                                            >
                                                Change Photo
                                            </button>
                                        )}
                                        <div className="relative flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg w-full h-32">
                                            {posterPreview ? (
                                                <img
                                                    src={posterPreview}
                                                    alt="Poster Preview"
                                                    className="w-32 h-32 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <label
                                                    htmlFor="poster-upload"
                                                    className="cursor-pointer text-gray-500"
                                                >
                                                    Upload Photo
                                                </label>
                                            )}
                                            <input
                                                type="file"
                                                id="poster-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePosterChange}
                                            />
                                        </div>
                                        <div className="w-full flex items-center mb-5">
                                            <button type="submit" className="w-full h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600">{tempActors ? 'Update Actor' : 'Add New Actor'}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {message && (
                            <div className={`mb-4 p-2 text-white rounded ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {message}
                            </div>
                        )}

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
                        
                            <ActorList 
                                actors={currentActors} 
                                editActors={editActors} 
                                deleteActors={deleteActors}
                                setTempActors={setTempActors} 
                                editingActorId={editingActorId}
                                actorsPerPage={actorsPerPage}
                                currentPage={currentPage}
                            />

                        </div>
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
                </main>
            </div>
        </div>
    );
};

export default CMSActors;
