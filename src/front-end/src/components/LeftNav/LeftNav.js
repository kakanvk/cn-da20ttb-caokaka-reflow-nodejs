import './LeftNav.css'
import logo from '../../imgs/logo.png'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function LeftNav() {

    const location = useLocation();

    return (
        <div className='LeftNav'>
            <div className='LeftNav_img'>
                <img src={logo} alt="" />
            </div>
            <div className='LeftNav_tab'>
                <Link className={(location.pathname === '/') ? "LeftNav_tab_item tab_active" : "LeftNav_tab_item"} to="/">
                    <ion-icon name="home"></ion-icon>
                    <span>Trang chủ</span>
                </Link>
                <Link className={(location.pathname.startsWith('/songs')) ? "LeftNav_tab_item tab_active" : "LeftNav_tab_item"} to="/songs">
                    <ion-icon name="musical-notes"></ion-icon>
                    <span>Kho bài hát</span>
                </Link>
                <Link className={(location.pathname.startsWith('/screens')) ? "LeftNav_tab_item tab_active" : "LeftNav_tab_item"} to="/screens">
                    <ion-icon name="film"></ion-icon>
                    <span>Phòng chiếu</span>
                </Link>
            </div>
        </div>
    )
}

export default LeftNav;