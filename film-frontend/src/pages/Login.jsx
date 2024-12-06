import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const Login = () => {
    const [credentials, setCredentials] = useState({ identifier: "", password: "" });
    const [suspendInfo, setSuspendInfo] = useState(null);
    const navigate = useNavigate();

    // Google login callback handling
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const roleId = urlParams.get('role_id');
        const username = urlParams.get('username');
        const isSuspended = urlParams.get('is_suspended');
        const suspensionEnds = urlParams.get('suspension_ends');

        if (accessToken) {
            sessionStorage.setItem('token', accessToken);
            sessionStorage.setItem('role_id', roleId);
            sessionStorage.setItem('username', username);

            if (isSuspended === 'true') {
                setSuspendInfo(`Your account is suspended until ${suspensionEnds}`);
            } else {
                roleId === 'admin' ? navigate('/admin-dashboard') : navigate('/');
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('login', credentials);
            const { access_token, role_id, is_suspended, suspension_ends } = response.data;

            if (is_suspended) {
                setSuspendInfo(`Your account is suspended until ${suspension_ends}`);
            } else {
                sessionStorage.setItem('token', access_token);
                sessionStorage.setItem('role_id', role_id);
                sessionStorage.setItem('username', credentials.identifier);
                sessionStorage.setItem('id', response.data.id);

                role_id === 'admin' ? navigate('/admin-dashboard') : navigate('/');
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            window.location.href = 'http://localhost:8000/api/auth/google';
        } catch (error) {
            console.error("Google login failed", error);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col gap-10 justify-center bg-neutral-200 bg-center">
            <div className="flex justify-center text-4xl font-bold text-gray-900 dark:text-yellow-900">LOGIN</div>
            {suspendInfo && (
                <div className="text-red-500 text-center mb-5">
                    {suspendInfo}
                </div>
            )}
            <form className="max-w-sm mx-auto w-full flex flex-col gap-3 items-center" onSubmit={handleSubmit}>
                <div className="w-full">
                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-900 dark:text-yellow-900">Your Email or Username</label>
                    <input
                        type="text"
                        name="identifier"
                        id="identifier"
                        className="shadow-sm rounded-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="name@flowbite.com or username"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-5 w-full">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-yellow-900">Your Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="shadow-sm rounded-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="********"
                        required
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full rounded-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900"
                >
                    Login with Google
                </button>
            </form>
        </div>
    );
};

export default Login;
