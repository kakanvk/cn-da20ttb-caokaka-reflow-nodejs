import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LeftNav from "../../components/LeftNav/LeftNav";
import Home from "./Home/Home";
import Songs from "./Songs/Songs";
import Screens from "./Screens/Screens";

import './UserLayout.css';
import Search from "./Search/Search";

function UserLayout() {
    const userContentRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (userContentRef.current) {
            userContentRef.current.scrollTop = 0;
        }
    }, [location]);

    return (
        <div className="UserLayout">
            <div className="User-nav">
                <LeftNav />
            </div>
            <div className="User-content" ref={userContentRef}>
                <div className="User-content-top">
                    <Header />
                    <div className="content-fill">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/songs" element={<Songs />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/screens/:id" element={<Screens />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default UserLayout;
