
import { useEffect, useState } from "react";
import premiumIcon from "../../../imgs/premium.png"
import logo from "../../../imgs/logo.png"
import bg from "../../../imgs/background/bg1.png"
import './Screens.css'
import { Link, useParams } from 'react-router-dom';
import { Spin, Tooltip, Dropdown, Menu } from 'antd';
import axios from "axios";

function Screens() {

    const { id } = useParams();

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [currentUserData, setCurrentUserData] = useState();

    const [lyricActiveTab, setLyricActiveTab] = useState(true);
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [visiblePara, setVisiblePara] = useState(2);

    const [lyrics, setLyrics] = useState();
    const [sentences, setSentences] = useState([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
    const [numberOfSentencesToShow, setNumberOfSentencesToShow] = useState(1);

    const [songsData, setSongsData] = useState();
    const [backgrounds, setBackgroundsData] = useState();
    const [featuredSongs, setFeaturedSongs] = useState([]);

    const [spinning, setSpinning] = useState(false);

    const handleViewMore = () => {
        if (visiblePara === lyrics.length)
            setVisiblePara(2);
        else setVisiblePara(lyrics.length);
    }

    const handleNextSentence = () => {
        if (currentSentenceIndex < sentences.length - numberOfSentencesToShow) {
            console.log("Next: ", currentSentenceIndex + numberOfSentencesToShow);
            setCurrentSentenceIndex((prevIndex) => prevIndex + numberOfSentencesToShow);
        }
    };

    const handlePreviousSentence = () => {
        if (currentSentenceIndex - numberOfSentencesToShow >= 0) {
            console.log("Previous: ", currentSentenceIndex - numberOfSentencesToShow);
            setCurrentSentenceIndex((prevIndex) => prevIndex - numberOfSentencesToShow);
        }
    };

    const handleOptionChange = ({ key }) => {
        setNumberOfSentencesToShow(parseInt(key, 10));
    };

    const renderLyrics = () => {
        const startIndex = currentSentenceIndex;
        const endIndex = startIndex + numberOfSentencesToShow;

        const displayedSentences = sentences.slice(startIndex, endIndex);

        return displayedSentences.map((item, index) => (
            <h1 key={index}>{item.sentence}</h1>
        ));
    };

    const handleChangeBackground = (_id) => {
        axios.put(`http://localhost:3005/api/users/edit-info`, {
            selected_background: _id
        }, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                fecthUserData();
            })
            .catch(error => {
                // console.error('Error fetching data:', error);
            });
    }

    const handleAddFavoriteSong = (_id) => {

        console.log(_id);

        axios.post(`http://localhost:3005/api/users/favorites`, {
            songId: _id
        }, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                fecthUserData();
            })
            .catch(error => {
                // console.error('Error fetching data:', error);
            });
    }

    const findFirstSentenceIndex = (paragraphId) => {
        let firstSentenceIndex = -1;

        sentences.some((sentence, index) => {
            if (sentence.paragraph_id === paragraphId) {
                firstSentenceIndex = index;
                return true;
            }
            return false;
        });

        return firstSentenceIndex;
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                handlePreviousSentence();
                break;
            case 'ArrowRight':
                handleNextSentence();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup để tránh memory leak
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentSentenceIndex, spinning]);

    const handleFullScreenToggle = () => {
        const elem = document.querySelector('.Screens_view');

        if (!isFullScreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        setIsFullScreen(!isFullScreen);
    };

    const fecthUserData = () => {
        axios.get(`http://localhost:3005/api/users/info`, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                setCurrentUserData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const fetchData = async () => {
        setSpinning(true);

        fecthUserData();
        try {
            const [songResponse, singerResponse, backgroundResponse] = await Promise.all([
                axios.get(`http://localhost:3005/api/songs/${id}`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/songs`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/backgrounds`, { withCredentials: true }),
            ]);

            // console.log(songResponse.data);
            // console.log(singerResponse.data);
            // console.log(backgroundResponse.data);

            setSongsData(songResponse.data);
            setFeaturedSongs(singerResponse.data);
            setBackgroundsData(backgroundResponse.data);

            const sectionsData = songResponse.data.sections
            setLyrics(sectionsData);

            const formattedLyrics = [];

            // Tách lời bài hát thành từng câu
            sectionsData.forEach(section => {
                const cleanedLyrics = section.lyrics.replace(/\n|<br\/>/g, '|');
                const sentences = cleanedLyrics.split('|');

                sentences.forEach(sentence => {
                    formattedLyrics.push({
                        paragraph: section.name,
                        sentence: sentence.trim(),
                        paragraph_id: section._id
                    });
                });
            });

            console.log(formattedLyrics);

            setSentences(formattedLyrics)

            setSpinning(false);

        } catch (error) {
            console.error(error);
        } finally {
            setSpinning(false);
        }
    };

    useEffect(() => {
        setCurrentSentenceIndex(0);
        fetchData();
    }, [id])

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement));
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('msfullscreenchange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('msfullscreenchange', handleFullScreenChange);
        };
    }, [isFullScreen]);

    return (
        <div className="Screens">
            <Spin spinning={spinning} fullscreen />
            <div className={`Screens_view ${isFullScreen ? 'fullscreen' : ''} dark_bg`}>
                <div className="Screens_view_bg">
                    <img src={currentUserData ? currentUserData.selected_background.image : "https://firebasestorage.googleapis.com/v0/b/chat-app-5b28c.appspot.com/o/reflow%2Fbg1.png?alt=media&token=d6f68ce0-20e8-49eb-a0a6-bc9f9b510294"} alt="" />
                </div>
                <div className="Screens_view_name">
                    <div>
                        <ion-icon name="musical-notes"></ion-icon>
                        <span>{songsData?.title} | {songsData?.singerId.name}</span>
                    </div>
                    <img src={logo} alt="" />
                </div>
                <div className="Screens_view_main">
                    {renderLyrics()}
                </div>
                <div className="Screens_view_option">
                    <div className="Screens_view_option_left">
                        {
                            lyrics?.map((ly, index) => {
                                return (
                                    <div key={index} className={sentences[currentSentenceIndex]?.paragraph_id === ly._id ? "currentSection" : ""}>
                                        <span onClick={() => { setCurrentSentenceIndex(findFirstSentenceIndex(ly._id)) }}>{ly.name}</span>
                                        {index + 1 !== lyrics.length ? <ion-icon name="chevron-forward-outline"></ion-icon> : ''}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="Screens_view_option_right">
                        <Dropdown
                            overlay={
                                <Menu onClick={handleOptionChange} selectedKeys={numberOfSentencesToShow}>
                                    <Menu.Item key="1">Hiển thị 1 câu</Menu.Item>
                                    <Menu.Item key="2">Hiện thị 2 câu</Menu.Item>
                                    <Menu.Item key="3">Hiển thị 3 câu</Menu.Item>
                                </Menu>
                            }
                            placement="top"
                            trigger={['click']}
                            getPopupContainer={() => document.querySelector('.Screens_view')}
                        >
                            <ion-icon name="settings-outline"></ion-icon>
                        </Dropdown>
                        <Tooltip title="Hình nền" getPopupContainer={() => document.querySelector('.Screens_view')}>
                            <ion-icon name="image-outline" onClick={() => setVisiblePopup(!visiblePopup)}></ion-icon>
                        </Tooltip>
                        <Tooltip title="Slide trước" getPopupContainer={() => document.querySelector('.Screens_view')}>
                            {/* Previous Slide */}
                            <ion-icon name="chevron-back-outline" onClick={handlePreviousSentence}></ion-icon>
                        </Tooltip>
                        <Tooltip title="Slide kế" getPopupContainer={() => document.querySelector('.Screens_view')}>
                            {/* Next Slide */}
                            <ion-icon name="chevron-forward-outline" onClick={handleNextSentence}></ion-icon>
                        </Tooltip>
                        <Tooltip title={isFullScreen ? "Thu nhỏ" : "Toàn màn hình"} getPopupContainer={() => document.querySelector('.Screens_view')}>
                            <ion-icon name="scan" onClick={handleFullScreenToggle}></ion-icon>
                        </Tooltip>
                        {
                            visiblePopup &&
                            <>
                                <div className='overplay' onClick={() => setVisiblePopup(!visiblePopup)}></div>
                                <div className="Screens_view_option_right_popup">
                                    <div className="option_right_popup_free">
                                        <h4>Miễn phí</h4>
                                        <div>
                                            {
                                                backgrounds?.map((background) => {
                                                    if (!background.premium_only) {
                                                        return (
                                                            <div
                                                                key={background._id}
                                                                className={currentUserData?.selected_background._id === background._id ? "selected_background" : ""}
                                                                onClick={() => { handleChangeBackground(background._id) }}
                                                            >
                                                                <img src={background.image} alt="" />
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="option_right_popup_pre">
                                        <h4>Premium<img src={premiumIcon} alt="" /></h4>
                                        <div>
                                            {
                                                backgrounds?.map((background) => {
                                                    if (background.premium_only) {
                                                        return (
                                                            <div
                                                                key={background._id}
                                                                className={currentUserData?.selected_background._id === background._id ? "selected_background" : ""}
                                                                onClick={() => { handleChangeBackground(background._id) }}
                                                            >
                                                                <img src={background.image} alt="" />
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
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
                <span>{songsData?.title}</span>
            </div>
            <div className='Screens_songName'>
                <div>
                    <span>{songsData?.title}</span>
                    <button onClick={() => { handleAddFavoriteSong(songsData._id) }}>
                        <ion-icon name="heart-outline"></ion-icon>
                        <span>Thêm vào danh sách yêu thích</span>
                    </button>
                </div>
                <Link to={`/singers/${songsData?.singerId._id}`}>{songsData?.singerId.name}</Link>
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
                                lyrics?.slice(0, visiblePara)?.map((ly, index) => {
                                    return (
                                        <div className="lyric_content-option1-p" key={ly._id}>
                                            <div className="lyric_content-option1-p_label">
                                                <ion-icon name="musical-note"></ion-icon>
                                                <span>{ly.name}:</span>
                                            </div>
                                            <div className="lyric_content-option1-p_para">
                                                {ly.lyrics.replace(/<br\/>/g, '\n')}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <button onClick={() => handleViewMore()}>
                                {
                                    visiblePara !== lyrics?.length ?
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
                                    lyrics?.map((ly) => {
                                        return (
                                            <button key={ly._id}>{ly.name}</button>
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
                        featuredSongs.map((song, index) => {
                            return (
                                <Link className='song_mini_box' to={`/screens/${song?._id}`} key={song?._id}>
                                    <div className='song_mini_box_img'>
                                        <img src={song?.image} alt='' />
                                    </div>
                                    <div className='song_mini_box_text'>
                                        <h4>{song?.title}</h4>
                                        <span>{song?.singerId.name}</span>
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