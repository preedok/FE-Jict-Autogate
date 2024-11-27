import React, { useState } from "react";
import Sidebar from "../components/navbar/Navigation.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const versi = import.meta.env.REACT_APP_APP_VERSION
    return (
        <div className="flex h-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className={`flex-1 ${isSidebarOpen ? "sm:ml-52 transition-all duration-500 ease-out" : "transition-all duration-500 ease-out"} flex flex-col overflow-hidden p-2 mt-[98px] overflow-y-auto`}>
                <Outlet />
                {/* <h1 className="ms-auto me-4 mt-3">Versi {versi}</h1> */}
            </div>
        </div>
    );
};

export default Layout;
