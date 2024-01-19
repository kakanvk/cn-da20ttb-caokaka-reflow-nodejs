
import { useEffect, useState } from 'react';
import './Header.css'

import avt from "../../imgs/avt.jpg"
import premiumIcon from "../../imgs/premium.png"
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {

    const navigate = useNavigate();
    const location = useLocation();

    const [suggestDisplay, setSuggestDisplay] = useState(false);
    const [searchButtonDisplay, setSearchButtonDisplay] = useState(false);
    const [popupDisplay, setPopupDisplay] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const [currentUser, setCurrentUser] = useState();

    const suggests = [
        {
            text: "Sơn Tùng M-TP"
        },
        {
            text: "Hoà Minzy"
        },
        {
            text: "Lạc Trôi"
        },
        {
            text: "Cắt Đôi Nổi Sầu"
        },
        {
            text: "Tháng tư là lời nói dối của em"
        },
        {
            text: "Phan Mạnh Quỳnh"
        },
        {
            text: "Có chàng trai viết lên cây"
        },
        {
            text: "Đại minh tinh"
        },
        {
            text: "Nàng thơ"
        },
        {
            text: "À lôi"
        },
        {
            text: "Sau này hãy gặp lại nhau khi hoa nở"
        },
        {
            text: "Mỹ Tâm"
        },
        {
            text: "Sự mập mờ"
        },
        {
            text: "Răng khôn"
        },
        {
            text: "Suni Hạ Linh"
        }
    ]

    const handleSearchSong = () => {
        setSuggestDisplay(false);
        navigate(`/search?keyword=${searchInput}`);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSong();
        }
    }

    const handleChangeTextInput = (e) => {
        setSearchButtonDisplay(!(e.target.value === ''));
        setSearchInput(e.target.value)
    }

    const fecthUserData = () => {
        axios.get(`http://localhost:3005/api/users/info`, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                setCurrentUser(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleLogout = () => {
        axios.get(`http://localhost:3005/api/auth/logout`, {
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                window.location.reload();
            })
            .catch(error => {
                // console.log(error);
            });
    }

    const handleLoginClick = () => {

        const stateData = {
            action: "redirect",
            url: location.pathname
        };

        navigate('/login', { state: stateData });
    }

    useEffect(() => {
        fecthUserData();
    }, [])

    return (
        <div className="Header">
            <div className='Header_search'>
                <div className='Header_search_input'>
                    <ion-icon name="search"></ion-icon>
                    <input type='text' placeholder='Tìm kiếm...'
                        onFocus={() => setSuggestDisplay(true)}
                        onChange={(e) => handleChangeTextInput(e)}
                        onKeyDown={(e) => handleKeyDown(e)}
                        value={searchInput}
                    />
                    {
                        searchButtonDisplay &&
                        <span
                            onClick={() => { handleSearchSong() }}
                        >Tìm kiếm</span>
                    }
                </div>
                {
                    suggestDisplay &&
                    <>
                        <div className='overplay' onClick={() => setSuggestDisplay(!suggestDisplay)}></div>
                        <div className='Header_search_suggest'>
                            <h2>Tìm kiếm nổi bật</h2>
                            <div className='search_suggest_container'>
                                {
                                    suggests.map((suggest, index) => {
                                        return (
                                            <Link className='search_suggest_item' key={index} to={`/search?keyword=${suggest.text}`} onClick={() => setSuggestDisplay(!suggestDisplay)}>
                                                <ion-icon name="search"></ion-icon>
                                                <span>{suggest.text}</span>
                                            </Link>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </>
                }
            </div>
            <img src={premiumIcon} alt='' />
            {
                currentUser ?
                    <div className='Header_avatar'>
                        <img src={currentUser.avatar} alt="" onClick={() => setPopupDisplay(!popupDisplay)} />
                        {
                            popupDisplay &&
                            <>
                                <div className='overplay' onClick={() => setPopupDisplay(!popupDisplay)}></div>
                                <div className='Header_avatar_popup'>
                                    <div className='avatar_popup_name'>
                                        <img src={currentUser.avatar} alt="" />
                                        <div>
                                            <h2>{currentUser.name}</h2>
                                            <span className={currentUser.role === "Premium" ? 'bradge-premium' : currentUser.role === "Admin" ? 'bradge-admin' : ''}>{currentUser.role}</span>
                                        </div>
                                    </div>
                                    {
                                        currentUser?.role === "Free" &&
                                        <div className='avatar_popup_premium'>
                                            <p>
                                                Nâng cấp tài khoản thành Premium để sử dụng đầy đủ mọi tính năng. Nâng cấp 1 lần, sử dụng mãi mãi.
                                            </p>
                                            <button>
                                                <img src={premiumIcon} alt='' />
                                                <span>Nâng cấp</span>
                                            </button>
                                        </div>
                                    }
                                    <div className='avatar_popup_option'>
                                        <h2>Cá nhân</h2>
                                        {
                                            currentUser.role === "Admin" ?
                                                <a href='/admin'>
                                                    <ion-icon name="settings-outline"></ion-icon>
                                                    <span>Admin Dashboard</span>
                                                </a>
                                                : ""

                                        }
                                        <a href='/'>
                                            <ion-icon name="heart-outline"></ion-icon>
                                            <span>Danh sách yêu thích</span>
                                        </a>
                                        <a href='/'>
                                            <ion-icon name="eye-outline"></ion-icon>
                                            <span>Đã xem gần đây</span>
                                        </a>
                                    </div>
                                    <div className='avatar_popup_option' onClick={() => handleLogout()}>
                                        <a>
                                            <ion-icon name="log-out-outline"></ion-icon>
                                            <span>Đăng xuất</span>
                                        </a>
                                    </div>
                                </div>
                            </>

                        }
                    </div> :
                    <button className='Login_button' onClick={() => handleLoginClick()}>Đăng nhập</button>
            }
        </div>
    )
}

export default Header;