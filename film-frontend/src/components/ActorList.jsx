import React, { useState } from 'react';

const ActorList = ({ actors, editActors, deleteActors, actorsPerPage, currentPage, setTempActors, editingActorId }) => {

    const handleEditClick = (actor) => {
        console.log(editingActorId)
        editingActorId = actor.id;
        setTempActors(actor);
    };

    const handleCancelClick = () => {
        editingActorId = null; 
        setTempActors(null);
    };

    const BASE_URL = `${import.meta.env.VITE_API_URL}/storage/`;

    // Fungsi untuk mendapatkan URL gambar yang benar
    const getImageUrl = (url) => {
        return url.startsWith('http') ? url : BASE_URL + url; // Menggunakan BASE_URL jika bukan URL lengkap
    };

    return (
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase bg-yellow-900">
                <tr>
                    <th className="w-1/12 px-4 py-4">No</th>
                    <th className="w-1/12 px-4 py-4">Countries</th>
                    <th className="w-3/12 px-4 py-4">Actor Name</th>
                    <th className="w-2/12 px-4 py-4">Birth Date</th>
                    <th className="w-3/12 px-4 py-4">Photos</th>
                    <th className="w-2/12 px-4 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {actors.map((item, index) => (
                    <tr key={item.id} className="border-b">
                        <th scope="row" className="w-1/12 px-4 py-3 font-medium text-black">{(currentPage - 1) * actorsPerPage + index + 1}</th>
                        <td className="w-3/12 px-4 py-3 font-medium text-black">{item.country.country}</td>
                        <td 
                            className="w-3/12 px-4 py-3 font-medium text-black cursor-pointer"
                        >
                            {item.name}
                        </td>
                        <td 
                            className="w-2/12 px-4 py-3 font-medium text-black cursor-pointer"
                        >
                            {item.birth_date}
                        </td>
                        <td className="w-1/12 px-4 py-3">
                            <img className="w-20 h-24" src={getImageUrl(item.url_photos)} alt={item.name} />
                        </td>
                        <td className="w-2/12 text-center text-black">
                            <div className="flex justify-center items-center">
                                {editingActorId === item.id ? (
                                    <>
                                        <button onClick={() => handleCancelClick()} className="flex py-2 px-4 text-black hover:text-red-600">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditClick(item)} className="flex py-2 px-4 text-black hover:text-blue-600">
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
                ))}
            </tbody>
        </table>
    );
};

export default ActorList;
