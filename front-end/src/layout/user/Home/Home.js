
import { Link } from 'react-router-dom';
import './Home.css'
import { Spin } from 'antd';
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

    const artists = [
        {
            name: "Sơn Tùng M-TP",
            imgURL: "https://yt3.googleusercontent.com/mm2-5anuZ6ghmK2zL6QM7wciD6kuupOfOagiAh5vZE1hx9tRhKEXTAExZUUY4PVq2RSw9jBpBQ=s900-c-k-c0x00ffffff-no-rj"
        },
        {
            name: "Hoà Minzy",
            imgURL: "https://vnn-imgs-f.vgcloud.vn/2019/12/25/08/hoa-minzy-co-thuc-luc-nhung-lan-dan-thi-phi-ngap-dau.jpg"
        },
        {
            name: "Phương Mỹ Chi",
            imgURL: "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/375455256_843021250525431_3801820340102275189_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEoVqfDFLtHV33OQ96uhySxUGttVF4o-JJQa21UXij4kvdfMrOEuM1Ecg4CUqcYFdROsRj5dz_PShq6getEWzig&_nc_ohc=B2YyzSVbvmIAX8C8nn3&_nc_ht=scontent.fsgn5-14.fna&oh=00_AfDlmqaNobZQ-aPJlcKsJqqLr0rYDi5LiW6v0g_BUEBaoA&oe=65943528"
        },
        {
            name: "Hoàng Dũng",
            imgURL: "https://i.scdn.co/image/ab6761610000e5eb63bf6330c331d0a1ec425700"
        },
        {
            name: "Suni Hạ Linh",
            imgURL: "https://yt3.googleusercontent.com/Vrnam6LrqnqZ-f31RZYbD1PkdT-A7ioPIKHCGITfeiqN4WxiMzEy7QrYnDjL2rC5B9HokVyFpCg=s900-c-k-c0x00ffffff-no-rj"
        },
        {
            name: "Đen Vâu",
            imgURL: "https://nld.mediacdn.vn/291774122806476800/2022/6/11/dsc07770-1654923515827557389390.jpg"
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

    return (
        <div className="Home">
            <Spin spinning={spinning} fullscreen />
            <div className='Home_banner'>

            </div>
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
                        featuredSingers.map((artist, index) => {
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
    )
}

export default Home;