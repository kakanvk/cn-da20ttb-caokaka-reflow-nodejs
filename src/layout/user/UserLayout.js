import { Route, Routes } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import LeftNav from "../../components/LeftNav/LeftNav";
import Home from "./Home/Home";

import './UserLayout.css'
import Songs from "./Songs/Songs";
import Screens from "./Screens/Screens";

function UserLayout() {
    return (
        <div className="UserLayout">
            <div className="User-nav">
                <LeftNav />
            </div>
            <div className="User-content">
                <div className="User-content-top">
                    <Header />
                    <div className="content-fill">
                        <Routes>
                            <Route path="/" element={<Home />}/>
                            <Route path="/songs" element={<Songs />}/>
                            <Route path="/screens" element={<Screens />}/>
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default UserLayout;