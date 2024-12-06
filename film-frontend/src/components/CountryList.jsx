import React, { useState } from 'react';

const CountryList = ({ countries, updateCountry, deleteCountry }) => {
    const [editingId, setEditingId] = useState(null);
    const [tempName, setTempName] = useState('');

    const handleDoubleClick = (country) => {
        setEditingId(country.id);
        setTempName(country.country); // Isi input dengan nama saat ini
    };

    const handleChange = (e) => {
        setTempName(e.target.value); // Update nama saat mengetik
    };

    const handleSave = (id) => {
        if (tempName.trim()) {
            updateCountry(id, tempName.trim()); // Simpan perubahan
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
                    <th scope="col" className="w-9/12 px-4 py-4">Countries</th>
                    <th scope="col" className="w-2/12 px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {countries.map((country, index) => (
                    <tr
                        key={country.id}
                        className="border-b border-gray-700"
                        onDoubleClick={() => handleDoubleClick(country)}
                    >
                        <th scope="row" className="px-4 py-3 font-medium text-black">
                            {index + 1}
                        </th>
                        <td className="px-4 py-3 font-medium text-black">
                            {editingId === country.id ? (
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={handleChange}
                                    onBlur={() => handleSave(country.id)}
                                    onKeyDown={(e) => handleKeyDown(e, country.id)}
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                                    autoFocus
                                />
                            ) : (
                                country.country
                            )}
                        </td>
                        <td className="text-center flex items-center justify-end">
                            <button 
                                onClick={() => handleDoubleClick(country)} 
                                className="flex py-2 px-4 hover:text-blue-600 text-black"
                            >
                                Rename
                            </button>
                            <span className="text-black">|</span>
                            <button
                                onClick={() => deleteCountry(country.id)}
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

export default CountryList;
