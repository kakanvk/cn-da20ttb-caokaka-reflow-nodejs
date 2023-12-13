
import { useState } from 'react';
import './Header.css'

import avt from "../../imgs/avt.jpg"
import premiumIcon from "../../imgs/premium.png"

function Header() {

    const [suggestDisplay, setSuggestDisplay] = useState(false);
    const [searchButtonDisplay, setSearchButtonDisplay] = useState(false);
    const [popupDisplay, setPopupDisplay] = useState(false);
    const [searchInput, setSearchInput] = useState('');

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

    const handleChangeTextInput = (e) => {
        setSearchButtonDisplay(!(e.target.value === ''));
        setSearchInput(e.target.value)
    }

    return (
        <div className="Header">
            <div className='Header_search'>
                <div className='Header_search_input'>
                    <ion-icon name="search"></ion-icon>
                    <input type='text' placeholder='Tìm kiếm...'
                        onFocus={() => setSuggestDisplay(true)}
                        onChange={(e) => handleChangeTextInput(e)}
                        value={searchInput}
                    />
                    {
                        searchButtonDisplay && <span>Tìm kiếm</span>
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
                                            <div className='search_suggest_item' key={index}>
                                                <ion-icon name="search"></ion-icon>
                                                <span>{suggest.text}</span>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </>
                }
            </div>
            {/* <button>Đăng nhập</button> */}
            <img src={premiumIcon} alt='' />
            <div className='Header_avatar'>
                <img src={avt} alt="" onClick={() => setPopupDisplay(!popupDisplay)} />
                {
                    popupDisplay &&
                    <>
                        <div className='overplay' onClick={() => setPopupDisplay(!popupDisplay)}></div>
                        <div className='Header_avatar_popup'>
                            <div className='avatar_popup_name'>
                                <img src={avt} alt="" />
                                <div>
                                    <h2>Ka Ka</h2>
                                    <span>Free</span>
                                </div>
                            </div>
                            <div className='avatar_popup_premium'>
                                <p>
                                    Nâng cấp tài khoản thành Premium để sử dụng đầy đủ mọi tính năng. Nâng cấp 1 lần, sử dụng mãi mãi.
                                </p>
                                <button>
                                    <img src={premiumIcon} alt='' />
                                    <span>Nâng cấp</span>
                                </button>
                            </div>
                            <div className='avatar_popup_option'>
                                <h2>Cá nhân</h2>
                                <a href='/'>
                                    <ion-icon name="heart-outline"></ion-icon>
                                    <span>Danh sách yêu thích</span>
                                </a>
                                <a href='/'>
                                    <ion-icon name="eye-outline"></ion-icon>
                                    <span>Đã xem gần đây</span>
                                </a>
                            </div>
                            <div className='avatar_popup_option'>
                                <a href='/'>
                                    <ion-icon name="log-out-outline"></ion-icon>
                                    <span>Đăng xuất</span>
                                </a>
                            </div>
                        </div>
                    </>

                }
            </div>
        </div>
    )
}

export default Header;