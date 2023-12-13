
import { useState } from "react";
import premiumIcon from "../../../imgs/premium.png"
import logo from "../../../imgs/logo.png"
import './Screens.css'
import { Link } from 'react-router-dom';

function Screens() {

    const [lyricActiveTab, setLyricActiveTab] = useState(true);
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [visiblePara, setVisiblePara] = useState(2);

    const handleViewMore = () => {
        if (visiblePara === lyrics.length)
            setVisiblePara(2);
        else setVisiblePara(lyrics.length);
    }

    const lyrics = [
        {
            paragraph: "Verse 1",
            lyric: "Mùa xuân có em như chưa bắt đầu Và cơn gió đang khẽ mơn man Lay từng nhành hoa rơi Em đã bước tới như em đã từng Chạy trốn với anh trên cánh đồng xanh Khúc nhạc hòa cùng Nắng chiều dịu dàng Để mình gần lại mãi Nói lời thì thầm Những điều thật thà Đã giữ trong tim mình Những chặng đường dài Ngỡ mình mệt nhoài Đã một lần gục ngã Tháng tư có em ở đây Nhìn tôi mỉm cười"
        },
        {
            paragraph: "Chorus",
            lyric: "Những cánh hoa phai tàn thật nhanh Em có bay xa em có đi xa mãi Tháng tư đôi khi thật mong manh Để mình nói ra những câu chân thật Giá như tôi một lần tin em Cô gái tôi thương Nay hóa theo mây gió Để lại tháng tư ở đó"
        },
        {
            paragraph: "Verse 2",
            lyric: "Mùa xuân có em như chưa bắt đầu Và cơn gió đang khẽ mơn man Lay từng nhành hoa rơi Em đã bước tới như em đã từng Chạy trốn với anh trên cánh đồng xanh Khúc nhạc hòa cùng Nắng chiều dịu dàng Để mình gần lại mãi Nói lời thì thầm Những điều thật thà Đã giữ trong tim mình Những chặng đường dài Ngỡ mình mệt nhoài Đã một lần gục ngã Tháng tư có em ở đây Nhìn tôi mỉm cười"
        },
        {
            paragraph: "Chorus",
            lyric: "Những cánh hoa phai tàn thật nhanh Em có bay xa em có đi xa mãi Tháng tư đôi khi thật mong manh Để mình nói ra những câu chân thật Giá như tôi một lần tin em Cô gái tôi thương Nay hóa theo mây gió Để lại tháng tư ở đó"
        }
    ]

    const songs = [
        {
            name: "Cắt Đôi Nổi Sầu",
            imgURL: "https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/b/f/0/1/bf0182328238f2a252496a63e51f1f74.jpg",
            artist: "Tăng Duy Tân"
        },
        {
            name: "À Lôi",
            imgURL: "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/6/d/9/6/6d961b2a82f151a0f9af7de928e8f809.jpg",
            artist: "Double2T, Masew"
        },
        {
            name: "Đại Minh Tinh",
            imgURL: "https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/4/7/6/0/4760f00f8520b4bb791b0f3665146acf.jpg",
            artist: "Văn Mai Hương"
        },
        {
            name: "Sự Mập Mờ",
            imgURL: "https://avatar-ex-swe.nixcdn.com/song/2023/07/10/8/5/a/e/1688956593288_640.jpg",
            artist: "Suni Hạ Linh"
        },
        {
            name: "Vũ Trụ Có Anh",
            imgURL: "https://avatar-ex-swe.nixcdn.com/song/2023/04/24/7/a/f/6/1682331078106_640.jpg",
            artist: "Phương Mỹ Chi"
        },
        {
            name: "Lệ Lưu Ly",
            imgURL: "https://i.scdn.co/image/ab67616d00001e02e75f76ad00f94ccc944a8bb7",
            artist: "Vũ Phụng Tiên, DT Tập Rap"
        },
        {
            name: "Sau Này Hãy Gặp Lại Nhau Khi Hoa Nở",
            imgURL: "https://i.scdn.co/image/ab67616d0000b27378778250664be09016d23beb",
            artist: "Nguyên Hà"
        },
        {
            name: "Răng Khôn",
            imgURL: "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/1/f/8/0/1f80ef41025ca9387ab54229adfa40b1.jpg",
            artist: "Phí Phương Anh"
        },
        {
            name: "Kẻ Theo Đuổi Ánh Sáng",
            imgURL: "https://avatar-ex-swe.nixcdn.com/song/2023/02/01/4/5/f/2/1675245493218_640.jpg",
            artist: "Huy Vạc"
        },
        {
            name: "Chân Ái",
            imgURL: "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/f/a/3/1/fa3151ee9ed079bf2fdb223b7ee10e14.jpg",
            artist: "Orange, Khói, Châu Đăng Khoa"
        }
    ]

    const addLineBreaks = (text) => {
        const sentences = text.split(/(?=\p{Lu})/u);

        const result = sentences.map((sentence, index) => (
            <p key={index}>
                {index !== 0 && sentence[0] && sentence[0].toUpperCase() === sentence[0 - 1]?.toUpperCase() ? <br /> : null}
                {sentence}
            </p>
        ));
        return result;
    };

    return (
        <div className="Screens">
            <div className='Screens_view'>
                <div className="Screens_view_name">
                    <div>
                        <ion-icon name="musical-notes"></ion-icon>
                        <span>Tháng Tư Là Lời Nói Dối Của Em | Hà Anh Tuấn</span>
                    </div>
                    <img src={logo} alt="" />
                </div>
                <div className="Screens_view_main">
                    <h1>Em đã bước tới như anh đã từng</h1>
                    <h1>Chạy trốn với anh trên cánh đồng xanh</h1>
                </div>
                <div className="Screens_view_option">
                    <div className="Screens_view_option_left">
                        {
                            lyrics.map((ly, index) => {
                                return (
                                    <div key={index}>
                                        <span>{ly.paragraph}</span>
                                        {index + 1 !== lyrics.length ? <ion-icon name="chevron-forward-outline"></ion-icon> : ''}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="Screens_view_option_right">
                        <ion-icon name="image-outline" onClick={() => setVisiblePopup(!visiblePopup)}></ion-icon>
                        <ion-icon name="chevron-back-outline"></ion-icon>
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                        <ion-icon name="scan"></ion-icon>
                        {
                            visiblePopup &&
                            <>
                                <div className='overplay' onClick={() => setVisiblePopup(!visiblePopup)}></div>
                                <div className="Screens_view_option_right_popup">
                                    <div className="option_right_popup_free">
                                        <h4>Miễn phí</h4>
                                        <div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                    <div className="option_right_popup_pre">
                                        <h4>Premium<img src={premiumIcon} alt="" /></h4>
                                        <div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className='Screens_top'>
                <Link to="/screens">Phòng chiếu</Link>
                <ion-icon name="chevron-forward"></ion-icon>
                <span>Tháng tư là lời nói dối của em</span>
            </div>
            <div className='Screens_songName'>
                <div>
                    <span>Tháng tư là lời nói dối của em</span>
                    <button>
                        <ion-icon name="heart-outline"></ion-icon>
                        <span>Thêm vào danh sách yêu thích</span>
                    </button>
                </div>
                <Link>Hà Anh Tuấn</Link>
            </div>
            <div className='Screens_lyric'>
                <div className="Screens_lyric_tab">
                    <button className={lyricActiveTab ? "activeTab" : ""} onClick={() => setLyricActiveTab(true)}>Lời bài hát</button>
                    <button className={!lyricActiveTab ? "activeTab" : ""} onClick={() => setLyricActiveTab(false)}>
                        <span>Tuỳ chỉnh cấu trúc</span>
                        <img src={premiumIcon} alt='' />
                    </button>
                </div>
                <div className="Screens_lyric_content">
                    {
                        lyricActiveTab &&
                        <div className="lyric_content-option1">
                            {
                                lyrics.slice(0, visiblePara).map((ly, index) => {
                                    return (
                                        <div className="lyric_content-option1-p" key={index}>
                                            <div className="lyric_content-option1-p_label">
                                                <ion-icon name="musical-note"></ion-icon>
                                                <span>{ly.paragraph}:</span>
                                            </div>
                                            <div className="lyric_content-option1-p_para">
                                                {addLineBreaks(ly.lyric)}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <button onClick={() => handleViewMore()}>
                                {
                                    visiblePara !== lyrics.length ?
                                        <>
                                            <ion-icon name="chevron-down"></ion-icon>
                                            <span>Xem toàn bộ</span>
                                        </>
                                        :
                                        <>
                                            <ion-icon name="chevron-up"></ion-icon>
                                            <span>Thu gọn</span>
                                        </>
                                }
                            </button>
                        </div>
                    }
                    {
                        !lyricActiveTab &&
                        <div className="lyric_content-option2">
                            <p>Kéo thả để thay đổi thứ tự các đoạn</p>
                            <div>
                                {
                                    lyrics.map((ly, index) => {
                                        return (
                                            <button key={index}>{ly.paragraph}</button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='Home_content'>
                <div className='Home_content_title'>
                    <span>Đề xuất</span>
                </div>
                <div className='Home_content_songs'>
                    {
                        songs.map((song, index) => {
                            return (
                                <Link className='song_mini_box' to="/songs/abc" key={index}>
                                    <div className='song_mini_box_img'>
                                        <img src={song.imgURL} alt='' />
                                    </div>
                                    <div className='song_mini_box_text'>
                                        <h4>{song.name}</h4>
                                        <span>{song.artist}</span>
                                    </div>
                                    <ion-icon name="ellipsis-vertical"></ion-icon>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default Screens;