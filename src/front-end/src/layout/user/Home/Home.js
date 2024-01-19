
import { Link } from 'react-router-dom';
import banner from "../../../imgs/banner.png";
import banner2 from "../../../imgs/banner2.png";
import banner3 from "../../../imgs/banner3.png";
import './Home.css'
import { Spin, Carousel } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {

    const [featuredSongs, setFeaturedSongs] = useState([]);
    const [featuredSingers, setFeaturedSingers] = useState([]);

    const [spinning, setSpinning] = useState(false);

    const fetchData = async () => {
        setSpinning(true);

        try {
            const [songResponse, singerResponse] = await Promise.all([
                axios.get(`http://localhost:3005/api/songs`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/singers`, { withCredentials: true }),
            ]);

            console.log(songResponse.data);
            console.log(singerResponse.data);

            setFeaturedSongs(songResponse.data);
            setFeaturedSingers(singerResponse.data);

            setSpinning(false);

        } catch (error) {
            console.error(error);
        } finally {
            setSpinning(false);
        }
    };

    useEffect(() => {

        fetchData();
    }, [])

    return (
        <div className="Home">
            <Spin spinning={spinning} fullscreen />
            <Carousel autoplay autoplaySpeed={3000}>
                <div className='Home_banner'>
                    <img src={banner} alt="" />
                </div>
                <div className='Home_banner'>
                    <img src={banner2} alt="" />
                </div>
                <div className='Home_banner'>
                    <img src={banner3} alt="" />
                </div>
            </Carousel>

            <div className='Home_content'>
                <div className='Home_content_title'>
                    <span>Nghệ sĩ nổi bật</span>
                    <Link to='/artist'>
                        <span>Xem tất cả</span>
                        <ion-icon name="arrow-forward"></ion-icon>
                    </Link>
                </div>
                <div className='Home_content_artists'>
                    {
                        featuredSingers.slice(0, 7).map((artist, index) => {
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
            <div className='Home_content'>
                <div className='Home_content_title'>
                    <span>Bài hát nổi bật</span>
                    <Link to="/songs">
                        <span>Xem tất cả</span>
                        <ion-icon name="arrow-forward"></ion-icon>
                    </Link>
                </div>
                <div className='Home_content_songs'>
                    {
                        featuredSongs.slice(0, 10).map((song, index) => {
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
    )
}

export default Home;