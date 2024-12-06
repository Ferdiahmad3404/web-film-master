import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Ambil token dan role_id dari URL
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('access_token');
        const roleId = queryParams.get('role_id');

        console.log("Token:", token);

        if (token && roleId) {
            // Simpan token dan role_id di sessionStorage
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role_id', roleId);

            // Arahkan pengguna berdasarkan peran (role)
            if (roleId === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }
        } else {
            console.error("Login failed: Token or role_id is missing");
        }
    }, [navigate]);

    return <div>Loading...</div>; // Tampilan sementara saat proses redirect
};

export default GoogleCallback;
