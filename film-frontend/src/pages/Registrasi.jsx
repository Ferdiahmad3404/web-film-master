import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const Registrasi = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role_id, setRoleId] = useState('user'); // Default 'user'
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validasi password dan konfirmasi password
        if (password !== repeatPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            
            const requestData = {
                email,
                password,
                username,
                password_confirmation: repeatPassword,
                role_id,
            };

            console.log("Data yang dikirim:", requestData);

            const response = await api.post('register', requestData);
            
            
            // Setelah registrasi berhasil, arahkan ke halaman login
            if (response.status === 201) {
                alert('Registration successful, please log in');
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage('Registration failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    };

    return (
        <div className="w-screen h-screen flex flex-col gap-10 justify-center bg-neutral-200 bg-center">
            <div className="flex justify-center text-4xl font-bold text-gray-900 dark:text-yellow-900">REGISTRATION</div>
            <form onSubmit={handleRegister} className="max-w-sm mx-auto w-full flex flex-col gap-3 items-center">
                <div className="mb w-full">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-yellow-900">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-full border-yellow-500 focus:border-yellow-700 focus:ring-yellow-700 block w-full p-2.5 dark:bg-transparent dark:border-yellow-900 dark:placeholder-gray-400 dark:text-yellow-900 dark:focus:ring-blue-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                        placeholder="Your username"
                        required
                    />
                </div>
                <div className="mb w-full">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-yellow-900">Your email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-full border-yellow-500 focus:border-yellow-700 focus:ring-yellow-700 block w-full p-2.5 dark:bg-transparent dark:border-yellow-900 dark:placeholder-gray-400 dark:text-yellow-900 dark:focus:ring-blue-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                        placeholder="name@gmail.com"
                        required
                    />
                </div>
                <div className="mb w-full">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-yellow-900">Your password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-yellow-900 dark:placeholder-gray-400 dark:text-yellow-900 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="********"
                        required
                    />
                </div>
                <div className="mb w-full">
                    <label htmlFor="repeat-password" className="block text-sm font-medium text-gray-900 dark:text-yellow-900">Repeat password</label>
                    <input
                        type="password"
                        id="repeat-password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-yellow-900 dark:placeholder-gray-400 dark:text-yellow-900 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="********"
                        required
                    />
                </div>
                <div className="mb w-full">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-900 dark:text-yellow-900">Role</label>
                    <select
                        id="role"
                        value={role_id}
                        onChange={(e) => setRoleId(e.target.value)}
                        className="shadow-sm bg-gray-50 border text-gray-900 text-sm rounded-full border-yellow-500 focus:border-yellow-700 focus:ring-yellow-700 block w-full p-2.5 dark:bg-transparent dark:border-yellow-900 dark:text-yellow-900 dark:focus:ring-blue-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex items-start mb-1 w-full">
                    <div className="flex items-center h-5 p-3">
                        <input
                            id="terms"
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                            required
                        />
                    </div>
                    <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-yellow-900">
                        I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>
                    </label>
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <button
                    type="submit"
                    className="w-full rounded-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    SignUp
                </button>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full rounded-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900"
                >
                    SignUp with Google
                </button>
            </form>
        </div>
    );
};

export default Registrasi;
