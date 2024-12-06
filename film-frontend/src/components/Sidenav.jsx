import { useEffect, useState } from "react";

const Sidenav = () => {
    const [role, setRole] = useState(null);

    const handleLogout = () => {
        sessionStorage.removeItem('token'); // Hapus token dari sessionStorage
        sessionStorage.removeItem('role_id'); // Hapus username dari sessionStorage
    };

    const handleCMS = () => {
        sessionStorage.setItem("selectedMenu", "drama");
    };

    useEffect(() => {
        // Mengambil role dari sessionStorage
        const userRole = sessionStorage.getItem('role_id');
        setRole(userRole);

        // Sidebar functionality
        const openBtn = document.getElementById('open-btn');
        const closeBtn = document.getElementById('close-btn');
        const sidebar = document.getElementById('sidebar');

        if (openBtn && closeBtn && sidebar) {
            openBtn.addEventListener('click', () => {
                sidebar.style.transform = 'translateX(0)';
            });

            closeBtn.addEventListener('click', () => {
                sidebar.style.transform = 'translateX(100%)';
            });
        }
    }, []);

    return (
        <>
            {/* Sidenav */}
            <div className="flex">
                <div className="bg-yellow-900 p-4 w-14 h-screen items-center justify-center sticky top-0">
                    
                    {/* Toggle Sidebar Button */}
                    <div className="absolute items-center justify-center top-1/2">
                        <button id="open-btn" className="text-4xl font-bold text-white">&equiv;</button>
                    </div>
                </div>
                {/* Sidebar Popup */}
                <div 
                    id="sidebar" 
                    className="fixed top-0 right-0 h-full w-1/4 bg-yellow-900 shadow-lg z-50 p-8" 
                    style={{ transform: 'translateX(100%)', transition: 'transform 0.3s ease' }}
                >
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="p-5 text-6xl font-bold text-white">DramaKu</h2>
                        <button id="close-btn" className="text-4xl text-white">&times;</button>
                    </div>
                    <nav className="p-5">
                        <ul>
                            {/* Menu berdasarkan role */}
                            {role === 'admin' && (
                                <>
                                    <li className="mb-4">
                                        <a href="/" className="sidebar-link text-2xl font-semibold text-white" onClick={handleCMS}>Home</a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="/admin-dashboard" className="sidebar-link text-2xl font-semibold text-white">CMS</a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="/" className="sidebar-link text-2xl font-semibold text-white" onClick={handleLogout}>Log Out</a>
                                    </li>
                                </>
                            )}
                            {role === 'user' && (
                                <>
                                    {/* <li className="mb-4">
                                        <a href="/" className="sidebar-link text-2xl font-semibold text-white">Profile</a>
                                    </li> */}
                                    <li className="mb-4">
                                        <a href="/" className="sidebar-link text-2xl font-semibold text-white">Home</a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="/cmsdramainput" className="sidebar-link text-2xl font-semibold text-white">Input Drama</a>
                                    </li>
                                    {/* <li className="mb-4">
                                        <a href="/user-profile" className="sidebar-link text-2xl font-semibold text-white">Profile</a>
                                    </li> */}
                                    <li className="mb-4">
                                        <a href="/" className="sidebar-link text-2xl font-semibold text-white" onClick={handleLogout}>Log Out</a>
                                    </li>   
                                </>
                            )}
                            {!role && (
                                <>
                                    <li className="mb-4">
                                        <a href="/login" className="sidebar-link text-2xl font-semibold text-white" onClick={handleCMS}>Login</a>
                                    </li>
                                    <li className="mb-4">
                                        <a href="/registrasi" className="sidebar-link text-2xl font-semibold text-white">Sign Up</a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidenav;
