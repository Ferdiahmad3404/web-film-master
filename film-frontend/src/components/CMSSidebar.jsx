import React from 'react';
import { useEffect, useState } from "react";

const CMSSidebar = () => {
    const [isDramaMenuOpen, setDramaMenuOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const userRole = sessionStorage.getItem('role_id');
        setRole(userRole);

        const storedMenu = sessionStorage.getItem('selectedMenu');
        if (storedMenu) {
            setSelectedMenu(storedMenu);
            if (storedMenu === "drama" || storedMenu === "validate" || storedMenu === "inputDrama") {
                setDramaMenuOpen(true);
            }
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role_id');
        sessionStorage.removeItem('selectedMenu');
    };

    const handleDramaClick = (e) => {
        e.preventDefault();
        setDramaMenuOpen(!isDramaMenuOpen);
        setSelectedMenu("drama");
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        sessionStorage.setItem("selectedMenu", menu);
        if (menu !== "drama") {
            setDramaMenuOpen(false);
        }
    };

    const menuClasses = (menu) => 
        `flex items-center px-4 py-3 text-lg rounded transition duration-200 ${
            selectedMenu === menu ? "bg-yellow-900 text-white" : "hover:bg-yellow-900 hover:text-white"
        }`;

    const handleHome = () => {
        sessionStorage.setItem("selectedMenu", "drama");
    };

    return (
        <aside className="w-64 h-screen bg-black bg-opacity-5 rounded-r-xl rounded-b-xl flex flex-col">
            <div className="p-6">
                <a className="text-3xl font-bold mb-6" href="/" onClick={handleHome}>DramaKu</a>
            </div>
            <nav className="flex-1">
                <ul>
                    {/* Home Menu Item */}
                    {(role === "user") && (
                        <li className="group">
                            <a href="/" className={menuClasses("home")}>
                                Home
                            </a>
                        </li>
                    )}
                    {/* Drama Menu Item */}
                    {(role === "admin") && (
                        <li>
                            <a 
                                href="/cmsdramas" 
                                onClick={handleDramaClick} 
                                className={menuClasses("drama")}
                            >
                                <svg className="w-6 h-6 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M3 10h1M4 6h16M4 14h16M4 18h16"></path>
                                </svg>
                                Drama
                                <svg className="w-4 h-4 ml-auto transition-transform transform ${isDramaMenuOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </a>
                        </li>
                    )}

                    {/* Submenu Items */}
                    {isDramaMenuOpen && role !== "user" && (
                        <>
                            <li className="pl-12">
                                <a href="/cmsdramas" onClick={() => handleMenuClick("validate")} className={menuClasses("validate")}>Validate</a>
                            </li>
                        </>
                    )}

                    {/* Input Drama Only for Users */}
                    {(role === "user" || role === "admin") && (
                        <li className="pl-12">
                            <a href="/cmsdramainput" onClick={() => handleMenuClick("inputDrama")} className={menuClasses("inputDrama")}>Input Drama</a>
                        </li>
                    )}

                    {/* Menu Lainnya untuk Admin atau Superadmin */}
                    {(role === "admin") && (
                        <>
                            <li className="group">
                                <a href="/cmscountries" onClick={() => handleMenuClick("countries")} className={menuClasses("countries")}>
                                    Countries
                                </a>
                            </li>
                            <li className="group">
                                <a href="/cmsawards" onClick={() => handleMenuClick("awards")} className={menuClasses("awards")}>
                                    Awards
                                </a>
                            </li>
                            <li className="group">
                                <a href="/cmsgenres" onClick={() => handleMenuClick("genres")} className={menuClasses("genres")}>
                                    Genres
                                </a>
                            </li>
                            <li className="group">
                                <a href="/cmsactors" onClick={() => handleMenuClick("actors")} className={menuClasses("actors")}>
                                    Actors
                                </a>
                            </li>
                            <li className="group">
                                <a href="/cmscomments" onClick={() => handleMenuClick("comments")} className={menuClasses("comments")}>
                                    Comments
                                </a>
                            </li>
                            <li className="group">
                                <a href="/cmsusers" onClick={() => handleMenuClick("users")} className={menuClasses("users")}>
                                    Users
                                </a>
                            </li>
                        </>
                    )}

                    <li className="group">
                        <a href="/" onClick={handleLogout} className={menuClasses("logout")}>
                            Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default CMSSidebar;