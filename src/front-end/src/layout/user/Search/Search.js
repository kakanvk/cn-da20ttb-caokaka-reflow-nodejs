
import { useEffect, useState } from "react";
import './Search.css'
import { Link, useLocation, useParams } from 'react-router-dom';
import { Spin } from 'antd';
import axios from "axios";

function Search() {

    const [spinning, setSpinning] = useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword');

    const [searchData, setSearchData] = useState();

    const fetchData = async () => {
        setSpinning(true);

        try {
            const [searchResponse] = await Promise.all([
                axios.get(`http://localhost:3005/api/search?keyword=${keyword}`, { withCredentials: true }),
            ]);

            console.log(searchResponse.data);
            setSearchData(searchResponse.data)


        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setSpinning(false);
            }, 500);
        }
    };

    useEffect(() => {
        fetchData();
    }, [keyword])

    return (
        <div className="Songs">
            <Spin spinning={spinning} fullscreen />
            {
                searchData?.singers.length === 0 && searchData?.songs.length === 0 ?
                    <div className="Search_noti">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <p>Không tìm thấy kết quả phù hợp cho <b>"{keyword}"</b></p>
                    </div>
                    :
                    <div className="Search_noti">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <p>Kết quả tìm kiếm cho <b>"{keyword}"</b></p>
                    </div>
            }
            {
                searchData?.singers.length > 0 &&
                <div className='Home_content'>
                    <div className='Home_content_title' style={{justifyContent: "flex-start", gap: "10px"}}>
                        <span>Nghệ sĩ</span>
                        <p>({searchData?.singers.length} kết quả)</p>
                    </div>
                    <div className='Home_content_artists search_artists' style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
                        {
                            searchData?.singers.map((artist, index) => {
                                return (
                                    <Link className='artist_box' to="/" key={artist?._id}>
                                        <div>
                                            <img src={artist.image} alt="" />
                                        </div>
                                        <h4>{artist.name}</h4>
                                        <span>Nghệ sĩ</span>
                                    </Link>
                                )
                            })
                        }

                    </div>
                </div>
            }
            {
                searchData?.songs.length > 0 &&
                <div className='Home_content'>
                    <div className='Home_content_title' style={{justifyContent: "flex-start", gap: "10px"}}>
                        <span>Bài hát</span>
                        <p>({searchData?.songs.length} kết quả)</p>
                    </div>
                    <div className='Home_content_songs'>
                        {
                            searchData?.songs.map((song, index) => {
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
            }
        </div>
    );
}

export default Search;