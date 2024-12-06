import React, { useState, useEffect } from 'react';
import CMSSidebar from '../components/CMSSidebar';
import Sidenav from '../components/Sidenav';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

const CMSDramaInput = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dramaId, setDramaId] = useState(null) ;
    // State untuk menyimpan data file dan preview poster
    const [posterPreview, setPosterPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        poster: '',
        title: '',
        alt_title: '',
        description: '',
        trailer: '',
        stream_site: '',
        year: '',
        status: 'pending',
        created_date: '',
        country_id: '',
        created_by: sessionStorage.getItem('username'),
        genres: [],
        actors: [],
        award: '',
    });
    
    // State untuk menyimpan data dari endpoint
    const [countries, setCountries] = useState([]);
    const [genres, setGenres] = useState([]);
    const [actors, setActors] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredActors, setFilteredActors] = useState([]);
    const [selectedActor, setSelectedActor] = useState([]);
    const [awards, setAwards] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const fetchCountries = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/countries`);
            const countriesData = await response.json(); // Get the data directly
    
            if (Array.isArray(countriesData)) { // Check if countriesData is an array
                setCountries(countriesData); // Set countries from the received data
            } else {
                console.error('Expected an array, but got:', countriesData);
                setCountries([]); // Set to empty array if data is not as expected
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
            setCountries([]); // Set to empty array on error
        }
    };    

    const fetchGenres = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/genres`);
            const result = await response.json();
    
            if (Array.isArray(result)) { // Check if success is true and data is an array
                setGenres(result); // Set actors from result.data
            } else {
                console.error('Data is not an array:', result);
                setGenres([]); // Set to empty array if data is not as expected
            }
        } catch (error) {
            console.error('Error fetching actors:', error);
            setGenres([]); // Set to empty array on error
        }
    };

    const fetchActors = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/actors`);
            const result = await response.json();
    
            if (result.success && Array.isArray(result.data)) { // Check if success is true and data is an array
                setActors(result.data); // Set actors from result.data
            } else {
                console.error('Data is not an array:', result);
                setActors([]); // Set to empty array if data is not as expected
            }
        } catch (error) {
            console.error('Error fetching actors:', error);
            setActors([]); // Set to empty array on error
        }
    };

    const fetchAwards = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/awards`);
            const result = await response.json()
            const filteredAwards = result.filter(award => award.drama_id === null)
            setAwards(filteredAwards)
        } catch (error) {
            console.error('Error fetching awards:', error);
            setAwards([]); // Set to empty array on error
        }
    };

    // Fetch data saat komponen dimuat
    useEffect(() => {
        fetchCountries();
        fetchGenres();
        fetchActors();
        fetchAwards();
        setFormData(prevData => ({
            ...prevData,
            created_by: sessionStorage.getItem('username')
        }));
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = actors.filter(actor =>
                actor.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredActors(filtered);
        } else {
            setFilteredActors([]);
        }
    }, [searchTerm, actors]);

    // Handler untuk upload poster
    const handlePosterChange = (event) => {
        const selectedFile = event.target.files[0];
        
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = function (e) {
                setPosterPreview(e.target.result); // Set poster preview
                setFile(selectedFile); // Set file ke state
            };

            reader.readAsDataURL(selectedFile);
        }
    };

    // Handler untuk ganti poster
    const handleChangePoster = () => {
        setPosterPreview(null);
        setFile(null);
    };

    // Handler untuk perubahan input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If the input is for the actors, update the search term
        if (name === 'actors') {
            setSearchTerm(value);
        }
        else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleActorSelect = (actor) => {
        // Check if the actor is already selected
        if (!selectedActor.some(selected => selected.id === actor.id)) {
            setSelectedActor(prev => [...prev, actor]); // Add the actor to the selected actors
            setFormData(prevData => ({
                ...prevData,
                actors: [...prevData.actors, actor.id], // Also update formData
            }));
        }
        setSearchTerm(''); // Clear the search term after selection
        setFilteredActors([]); // Clear the filtered actors
    };

    const handleActorRemove = (actorId) => {
        // Remove actor from selected actors
        setSelectedActor(prev => prev.filter(actor => actor.id !== actorId));
        setFormData(prevData => ({
            ...prevData,
            actors: prevData.actors.filter(actor => actor.id !== actorId), // Also update formData
        }));
    };

    // Mengubah genre yang dipilih
    const handleGenreChange = (id) => {
        if (selectedGenres.includes(id)) {
            setSelectedGenres(selectedGenres.filter((genreId) => genreId !== id)); // Hapus jika sudah ada
        } else {
            setSelectedGenres([...selectedGenres, id]); // Tambah jika belum ada
        }
    };

    const BASE_URL = 'http://localhost:8000/storage/'; // Ganti dengan URL dasar Anda

    // Fungsi untuk mendapatkan URL gambar yang benar
    const getImageUrl = (url) => {
        return url.startsWith('http') ? url : BASE_URL + url; 
    };

    useEffect(() => {
        // Jika ada film yang diterima dari halaman edit
        if (location.state?.drama) {
            const drama = location.state.drama;
            setDramaId(drama.id);
    
            const posterUrl = getImageUrl(drama.url_cover);
            console.log(posterUrl);
    
            setFormData({
                title: drama.title,
                alt_title: drama.alt_title,
                year: drama.year,
                country_id: drama.country_id,
                description: drama.description,
                stream_site: drama.stream_site,
                trailer: drama.trailer,
                status: drama.status,
                created_by: drama.created_by,
                award: drama.awards.join(', '),
                genres: drama.genres.map(genre => genre.id),
                actors: drama.actors.map(actor => actor.id),
            });
    
            // Set preview poster jika ada
            setSelectedGenres(drama.genres.map(genre => genre.id));
            setSelectedActor(drama.actors);
    
            // Cek apakah posterUrl diawali dengan http
            if (posterUrl.startsWith('http')) {
                setFile(posterUrl); 
                setPosterPreview(posterUrl); 
            } else {
                setFile(null); 
                setPosterPreview(posterUrl);
            }
        }
    }, [location.state]);

    useEffect(() => {
        console.log('Form Data:', formData);
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();

        // Menambahkan semua field ke FormData
        data.append('poster', file);
        data.append('title', formData.title);
        data.append('alt_title', formData.alt_title);
        data.append('description', formData.description);
        data.append('trailer', formData.trailer); // pastikan ini adalah URL yang valid
        data.append('stream_site', formData.stream_site);
        data.append('year', formData.year);
        data.append('status', formData.status);
        // data.append('created_date', new Date().toISOString()); // mengisi tanggal saat ini
        data.append('country_id', formData.country_id);
        data.append('created_by', formData.created_by);
        data.append('award', formData.award);

        selectedGenres.forEach(genre => {
            data.append('genres[]', genre); // gunakan 'genres[]' untuk mengindikasikan array
        });
        selectedActor.forEach(actor => {
            data.append('actors[]', actor.id); // gunakan 'actors[]' untuk mengindikasikan array
        });

        data.forEach((value, key) => {
            console.log(key, value);
        });

        setFormData({
            poster: '',
            title: '',
            alt_title: '',
            description: '',
            trailer: '',
            stream_site: '',
            year: '',
            status: '',
            created_date: '',
            country_id: '',
            created_by: '',
            genres: [],
            actors: [],
            award: '',
        });

        try {
            const response = await fetch('http://localhost:8000/films', {
                method: 'POST',
                body: data,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            console.log('Film added successfully:', result);
            showMessage('Film added successfully...', 'success');

            // Navigasi ke halaman lain setelah 5 detik
            setTimeout(() => {
                navigate('/admin-dashboard');
            }, 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('Error adding film: ' + error.message, 'error');
        }
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        const data = new FormData();

        console.log("formData:", formData);
    
        // Memastikan hanya menambahkan 'poster' jika itu adalah file
        if (file && typeof file !== 'string') {
            data.append('poster', file); // Menambahkan file poster yang baru
        } else if (file && typeof file === 'string') {
            // Jika poster adalah URL (bukan file), menambahkannya ke FormData
            data.append('url_cover', file);
        }
    
        // Menambahkan semua field lain ke FormData
        data.append('title', formData.title);
        data.append('alt_title', formData.alt_title);
        data.append('description', formData.description);
        data.append('trailer', formData.trailer);
        data.append('stream_site', formData.stream_site);
        data.append('year', formData.year);
        data.append('status', formData.status);
        data.append('country_id', formData.country_id);
    
        // Menambahkan genres dan actors sebagai array
        selectedGenres.forEach(genre => {
            data.append('genres[]', genre);
        });
        selectedActor.forEach(actor => {
            data.append('actors[]', actor.id);
        });
    
        data.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    
        try {
            const response = await fetch(`http://localhost:8000/films/${dramaId}`, {
                method: 'POST',
                body: data, // Menggunakan FormData yang sudah disiapkan
            });
    
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
    
            console.log('Film updated successfully:', result);
            showMessage('Film updated successfully...', 'success');
    
            // Navigasi ke halaman lain setelah 5 detik
            setTimeout(() => {
                    navigate('/admin-dashboard');
            }, 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('Error updating film: ' + error.message, 'error');
        }
    };
    

    const handleSubmitOrEdit = (e) => {
        if (location.state?.drama) {
            handleEdit(e);
        } else {
            handleSubmit(e);
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
                        <h1 className="text-2xl mb-5 font-medium">{location.state?.drama ? 'Update Drama' : 'Add New Drama'}</h1>

                        {message && (
                            <div className={`mb-4 p-2 text-white rounded ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmitOrEdit} className="flex w-full justify-between px-6 py-8 space-y-6 md:flex-row md:space-y-0">
                            <div className="w-2/6 max-w-sm p-5 flex flex-col">
                                {posterPreview && (
                                    <button
                                        onClick={handleChangePoster}
                                        className="items-center justify-center px-2 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                                    >
                                        Change Poster
                                    </button>
                                )}
                                <div className="relative flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg h-80">
                                    {posterPreview ? (
                                        <img
                                            src={posterPreview}
                                            alt="Poster Preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <label
                                            htmlFor="poster-upload"
                                            className="cursor-pointer text-gray-500"
                                        >
                                            Upload Poster
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
                                {location.state?.drama && (
                                    <div>
                                        <label htmlFor="status" className="block mt-10 text-sm font-medium text-gray-900">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="block w-full p-2.5 border border-gray-300 rounded-lg "
                                            style={{
                                                backgroundColor: formData.status === 'approved' ? 'green' :
                                                                formData.status === 'pending' ? 'blue' :
                                                                formData.status === 'unapproved' ? 'red' : 'gray',
                                                color: 'white'
                                            }}
                                        >
                                            <option value="">Select Status</option>
                                            <option value='approved' className="text-white">Approved</option>
                                            <option value='pending' className="text-white">Pending</option>
                                            <option value='unapproved' className="text-white">Unapproved</option>
                                        </select>
                                    </div>
                                )}
                                <button type="submit" className="w-full px-6 py-3 mt-14 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                                    {location.state?.drama ? 'Update Drama' : 'Submit'}
                                </button>
                            </div>
                            

                            <div className="w-full max-w-4xl space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="alt_title" className="block mb-2 text-sm font-medium text-gray-900">
                                            Alternative Title
                                        </label>
                                        <input
                                            type="text"
                                            id="alt_title"
                                            name="alt_title"
                                            value={formData.alt_title}
                                            onChange={handleInputChange}
                                            className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900">
                                            Year
                                        </label>
                                        <input
                                            type="text"
                                            id="year"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleInputChange}
                                            className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country_id" className="block mb-2 text-sm font-medium text-gray-900">
                                            Country
                                        </label>
                                        <select
                                            id="country_id"
                                            name="country_id"
                                            value={formData.country_id}
                                            onChange={handleInputChange}
                                            className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.sort((a, b) => a.country.localeCompare(b.country)).map((country) => (
                                                <option key={country.id} value={country.id} className="text-black">
                                                    {country.country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                                        Synopsis
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="stream_site" className="block mb-2 text-sm font-medium text-gray-900">
                                        Availability
                                    </label>
                                    <input
                                        type="text"
                                        id="stream_site"
                                        name="stream_site"
                                        value={formData.stream_site}
                                        onChange={handleInputChange}
                                        className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <span className="block mb-2 text-sm font-medium text-gray-900">Add Genres</span>
                                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                        {genres.map((genre) => (
                                            <div key={genre.id} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    id={`genre-${genre.id}`}
                                                    value={genre.id}
                                                    checked={selectedGenres.includes(genre.id)}
                                                    onChange={() => handleGenreChange(genre.id)}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={`genre-${genre.id}`} className="text-gray-700">
                                                    {genre.genre}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="actors" className="block mb-2 text-sm font-medium text-gray-900">
                                        Add Actors (Up to 9)
                                    </label>
                                    <input
                                        type="text"
                                        id="actors"
                                        name="actors"
                                        value={searchTerm}
                                        onChange={handleInputChange}
                                        className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                        placeholder="Search Actor Name(s)"
                                    />
                                    {filteredActors.length > 0 && (
                                        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                            {filteredActors.map(actor => (
                                                <div
                                                    key={actor.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleActorSelect(actor)} // Select actor on click
                                                >
                                                    {actor.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium">Selected Actors:</h3>
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {selectedActor.map(actor => (
                                                <div key={actor.id} className="h-24 bg-gray-200 rounded-md flex items-center justify-between p-4 gap-4">
                                                    <img
                                                        src={actor.url_photos}
                                                        alt={actor.name}
                                                        className="h-16 w-20 object-cover rounded-full"
                                                    />
                                                    <span>{actor.name}</span>
                                                    <button
                                                        onClick={() => handleActorRemove(actor.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="trailer" className="block mb-2 text-sm font-medium text-gray-900">
                                            Link Trailer
                                        </label>
                                        <input
                                            type="text"
                                            id="trailer"
                                            name="trailer"
                                            value={formData.trailer}
                                            onChange={handleInputChange}
                                            className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="award" className="block mb-2 text-sm font-medium text-gray-900">
                                            Award
                                        </label>
                                        <select
                                            id="award"
                                            name="award"
                                            value={formData.award}
                                            onChange={handleInputChange}
                                            className="block w-full p-2.5 border border-gray-300 rounded-lg"
                                        >
                                            <option value="-">Select Award</option>
                                            <option value="-">-</option>
                                            {awards.map((award) => (
                                                <option key={award.id} value={award.id} className="text-black">
                                                    {award.award}
                                                </option>
                                            ))}
                                        </select>
                                        {awards.length === 0 && (
                                            <p className="ml-2 mt-1 text-sm text-red-500">
                                                Tidak ada award yang tersedia.. hubungi admin..
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </main>
                    
                    <Sidenav />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CMSDramaInput;
