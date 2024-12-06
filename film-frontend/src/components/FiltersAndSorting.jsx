import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const FiltersAndSorting = ({ onFilterChange, onNameChange, genres, years, platforms, searchTerm : initialSearchTerm, filteredData }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedAwards, setSelectedAwards] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [dramas, setDramas] = useState(filteredData);
  const [isSearched, setIsSearched] = useState(true); // Menyimpan status pencarian
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const navigate = useNavigate();

  const title = searchTerm;
  const handleFilterChange = () => {
    onFilterChange({
      year: selectedYear,
      genre: selectedGenre,
      platform: selectedPlatform,
      awards: selectedAwards,
      sortOrder,
      searchTerm,
    });
  };

  const handleNameChange = () => {
    onNameChange({
      searchTerm,
    });
  };

  // Fungsi untuk menangani pencarian
  const handleSearch = () => {
    handleNameChange(); 
    setIsSearched(true); // Menandai bahwa pencarian telah dilakukan
    navigate(`/search/${encodeURIComponent(searchTerm)}`); // Redirect dengan search term
  };

  // Fungsi untuk mendeteksi tombol Enter di input search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleFilterChange();
      handleSearch();
    }
  };

  // Fungsi untuk menangani perubahan pada searchTerm
  const handleSearchChange = (e) => {
    if (e && e.target) {
      setSearchTerm(e.target.value);
      setIsSearched(false);
  
      // Menampilkan hasil autocomplete jika searchTerm panjangnya >= 3
      if (e.target.value.length > 1) {
        const filteredMovies = filteredData.filter(movie =>
          movie.title.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setAutocompleteResults(filteredMovies);
      } else {
        setAutocompleteResults([]);
      }
    }
  };

  const BASE_URL = `${import.meta.env.VITE_API_URL}/storage/`; // Ganti dengan URL dasar Anda

  // Fungsi untuk mendapatkan URL gambar yang benar
  const getImageUrl = (url) => {
    return url.startsWith('http') ? url : BASE_URL + url; // Menggunakan BASE_URL jika bukan URL lengkap
  };

  // Mengatur ulang search term saat initialSearchTerm berubah
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    handleNameChange();
    handleSearchChange();
  }, [initialSearchTerm]);

  useEffect(() => {
    handleFilterChange(); // Panggil setiap kali salah satu filter berubah
  }, [selectedYear, selectedGenre, selectedPlatform, selectedAwards, sortOrder]);

  return (
    <>
      <div id="content" className="mb-3 p-4 w-full flex space-x-4">
        <form>
          <select
            id="years"
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); }}
            className="cursor-pointer border text-sm rounded-full block w-full p-2.5 bg-yellow-900 hover:bg-yellow-700 text-white focus:ring-white focus:border-white"
          >
            <option value="">Choose a year</option>
            {years.slice().sort((b, a) => a.year - b.year).map(year => (
              <option key={year.id} value={year.year}>{year.year}</option>
            ))}
          </select>
        </form>
        <form>
          <select
            id="genre"
            value={selectedGenre}
            onChange={(e) => { setSelectedGenre(e.target.value); }}
            className="cursor-pointer border text-sm rounded-full block w-full p-2.5 bg-yellow-900 hover:bg-yellow-700 placeholder-yellow-900 text-white focus:ring-white focus:border-white"
          >
            <option value="">Choose a genre</option>
            {genres.slice().sort((a, b) => a.genre.localeCompare(b.genre)).map((genre) => (
              <option key={genre.id} value={genre.genre}>{genre.genre}</option>
            ))}
          </select>
        </form>
        <form>
          <select
            id="platform"
            value={selectedPlatform}
            onChange={(e) => { setSelectedPlatform(e.target.value); }}
            className="cursor-pointer border text-sm rounded-full block w-full p-2.5 bg-yellow-900 hover:bg-yellow-700 placeholder-yellow-900 text-white focus:ring-white focus:border-white"
          >
            <option value="">Choose a platform</option>
            {platforms.slice().sort((a, b) => a.platform.localeCompare(b.platform)).map(platform => (
              <option key={platform.id} value={platform.platform}>{platform.platform}</option>
            ))}
          </select>
        </form>
        <form>
          <select
            id="awards"
            value={selectedAwards}
            onChange={(e) => { setSelectedAwards(e.target.value); }}
            className="cursor-pointer border text-sm rounded-full block w-full p-2.5 bg-yellow-900 hover:bg-yellow-700 placeholder-yellow-900 text-white focus:ring-white focus:border-white"
          >
            <option value="">Awards</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </form>
        <form>
          <select
            id="alphabetics"
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); }}
            className="cursor-pointer border text-sm rounded-full block w-full p-2.5 bg-yellow-900 hover:bg-yellow-700 placeholder-yellow-900 text-white focus:ring-white focus:border-white"
          >
            <option value="">Alphabetics</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </form>
        <form className="flex-auto">
          <div className="flex w-full items-center">
            <div className="flex space-x-2 items-center justify-center w-full relative">
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  className="p-2 bg-neutral-200 border border-yellow-900 rounded-full w-full"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {handleSearchChange(e); setIsSearched(false); setSearchTerm(e.target.value); handleNameChange();}}
                  onKeyPress={handleKeyPress} // Menambahkan event handler untuk KeyPress
                />
                {autocompleteResults.length > 0 && (
                  <div className="absolute left-0 top-full mt-2 w-full h-96 bg-yellow-800 bg-opacity-90 rounded-md p-2 z-20 overflow-y-auto">
                    {autocompleteResults.map((movie) => (
                      <>
                        <div className="p- mb-1">
                          <div className="flex gap-5">
                            <div>
                              <img 
                                src={getImageUrl(movie.url_cover)} 
                                alt="" 
                                className="w-24 h-28 "
                                />
                            </div>
                            <div className="text-white p-2 w-full hover:bg-yellow-700 cursor-pointer">
                              <Link to={`/detailfilm/${movie.id}`}>
                                <h2 className="text-2xl font-semibold">{movie.title}<span> ({movie.year})</span></h2>
                                <p className="text-white">{movie.year}</p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex ">
                <button type="button"
                  onClick={handleSearch} // Menggunakan handleSearch untuk pencarian manual
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
                  Cari
                </button>
              </div>
            </div>
          </div>
        </form>

      </div>
    </>
  );
};

export default FiltersAndSorting;
