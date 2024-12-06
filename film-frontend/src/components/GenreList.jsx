import React, { useState } from 'react';

const GenreList = ({ genres, updateGenre, deleteGenre }) => {
    const [editingId, setEditingId] = useState(null);
    const [tempName, setTempName] = useState('');

    const handleDoubleClick = (genre) => {
        setEditingId(genre.id);
        setTempName(genre.genre); // Isi input dengan nama saat ini
    };

    const handleChange = (e) => {
        setTempName(e.target.value); // Update nama saat mengetik
    };

    const handleSave = (id) => {
        if (tempName.trim()) {
            updateGenre(id, tempName.trim()); // Simpan perubahan
        }
        setEditingId(null); // Keluar dari mode edit
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleSave(id); // Simpan perubahan jika tekan Enter
        }
    };

    return (
        <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-white uppercase bg-yellow-900">
                <tr>
                    <th scope="col" className="w-1/12 px-4 py-4 sr-only">No</th>
                    <th scope="col" className="w-9/12 px-4 py-4">Genres</th>
                    <th scope="col" className="w-2/12 px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {genres.map((genre, index) => (
                    <tr
                        key={genre.id}
                        className="border-b border-gray-700"
                        onDoubleClick={() => handleDoubleClick(genre)}
                    >
                        <th scope="row" className="px-4 py-3 font-medium text-black">
                            {index + 1}
                        </th>
                        <td className="px-4 py-3 font-medium text-black">
                            {editingId === genre.id ? (
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={handleChange}
                                    onBlur={() => handleSave(genre.id)}
                                    onKeyDown={(e) => handleKeyDown(e, genre.id)}
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                                    autoFocus
                                />
                            ) : (
                                genre.genre
                            )}
                        </td>
                        <td className="text-center flex items-center justify-end">
                            <button 
                                onClick={() => handleDoubleClick(genre)} 
                                className="flex py-2 px-4 hover:text-blue-600 text-black"
                            >
                                Rename
                            </button>
                            <span className="text-black">|</span>
                            <button
                                onClick={() => deleteGenre(genre.id)}
                                className="flex items-center py-2 px-4 hover:text-red-600 text-black"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default GenreList;
