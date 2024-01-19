
import { useEffect, useState } from "react";
import './Song.css'
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import axios from "axios";

function Songs() {

    const [spinning, setSpinning] = useState(false);

    const [songs, setSongs] = useState();
    const [categorys, setCategorys] = useState();


    const fetchData = async () => {
        setSpinning(true);

        try {
            const [songResponse, categoryResponse] = await Promise.all([
                axios.get(`http://localhost:3005/api/songs`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/categorys`, { withCredentials: true }),
            ]);

            setSongs(songResponse.data);
            setCategorys(categoryResponse.data)

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
        <div className="Songs">
            <Spin spinning={spinning} fullscreen />
            <div className='Home_content'>
                <div className='Home_content_title'>
                    <span>Thể loại</span>
                </div>
                <div className="Home_content_categories">
                    {
                        categorys?.map((category) => {
                            return (
                                <div className="categories_mini_box" key={category._id}>
                                    <span>{category.name}</span>
                                    <div></div>
                                    <img src={category.image} alt="" />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='Home_content'>
                <div className='Home_content_title'>
                    <span>Kho bài hát</span>
                </div>
                <div className='Home_content_songs'>
                    {
                        songs?.map((song, index) => {
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

export default Songs;