
import { FireOutlined, LockOutlined, MailOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Form, Input, Select, Spin, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Link, useNavigate, useParams } from 'react-router-dom';

function UpdateSong() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [SongData, setSongData] = useState();
    const [categorys, setCategorys] = useState([]);
    const [singers, setSingers] = useState([]);
    const [checkChangeAvtar, setCheckChangeAvatr] = useState(false);

    const successMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'success',
            content: 'Cập nhật thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'error',
            content: 'Cập nhật thất bại',
        });
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setCheckChangeAvatr(true);
    };

    const handleUpdateById = (newData) => {
        axios.put(`http://localhost:3005/api/songs/${id}`, newData, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                successMessage();
                setSpinning(true);
                setTimeout(() => {
                    navigate('/admin/songs');
                }, 1000);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                errorMessage();
            });
    }

    const onFinish = async (values) => {

        setSpinning(true);
        console.log(values);
        console.log(fileList);

        if (fileList[0] && checkChangeAvtar) {

            const file = fileList[0].originFileObj;

            const maxImageSize = 1024;

            try {
                let compressedFile = file;

                if (file.size > maxImageSize) {
                    compressedFile = await imageCompression(file, {
                        maxSizeMB: 0.8,
                        maxWidthOrHeight: maxImageSize,
                        useWebWorker: true,
                    });
                }

                const storageRef = ref(storage, `reflow/${compressedFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, compressedFile);

                uploadTask.on("state_changed",
                    (snapshot) => {

                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                            const newSongData = {
                                "title": values.title,
                                "image": downloadURL,
                                "singerId": values.singer,
                                "categoryId": values.category,
                            }

                            handleUpdateById(newSongData);

                            setSpinning(false);

                        });
                    }
                );
            } catch (error) {
                console.error('Image Compression Error:', error);
            }
        } else {
            try {
                const newSongData = {
                    "title": values.title,
                    "singerId": values.singer,
                    "categoryId": values.category,
                }

                handleUpdateById(newSongData);

                setSpinning(false);
            } catch (error) {

            }
        }

    };

    const fecthSongData = async () => {
        setSpinning(true);

        try {
            const [songResponse, categoryResponse, singerResponse] = await Promise.all([
                axios.get(`http://localhost:3005/api/songs/${id}`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/categorys`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/singers`, { withCredentials: true }),
            ]);

            setSongData(songResponse.data);
            setCategorys(categoryResponse.data);
            setSingers(singerResponse.data);

            setFileList([
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: songResponse.data.image,
                }
            ]);

            setSpinning(false);

        } catch (error) {
            console.error(error);
        } finally {
            setSpinning(false);
        }
    };

    useEffect(() => {
        fecthSongData();
    }, [])

    return (
        <Flex className="UpdateSong" vertical gap={20}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
                    },
                    {
                        title: <Link to="/admin/songs">Quản lý bài hát</Link>,
                    },
                    {
                        title: 'Cập nhật',
                    },
                    {
                        title: SongData?.title,
                    },
                ]}
            />
            {
                SongData &&
                <Form
                    name="reflow_login"
                    className="login-form"
                    style={{
                        width: "400px",
                        margin: "0 auto",
                    }}
                    initialValues={{
                        title: SongData.title,
                        category: SongData.categoryId._id,
                        singer: SongData.singerId._id,
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Tên bài hát"
                    >
                        <Input placeholder="Họ và tên" allowClear size="large" />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Thể loại"
                    >
                        <Select placeholder="Loại tài khoản" prefix={<FireOutlined className="site-form-item-icon" />} size="large" allowClear>
                            {
                                categorys.map((category) => {
                                    return (
                                        <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                                    )

                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="singer"
                        label="Ca sĩ"
                    >
                        <Select placeholder="Loại tài khoản" prefix={<FireOutlined className="site-form-item-icon" />} size="large" allowClear>
                            {
                                singers.map((singer) => {
                                    return (
                                        <Select.Option key={singer._id} value={singer._id}>{singer.name}</Select.Option>
                                    )

                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                    >
                        <ImgCrop showGrid>
                            <Upload
                                listType="picture-card"
                                defaultFileList={fileList}
                                valuePropName="avatar"
                                onChange={onChange}
                                onPreview={onPreview}
                                maxCount={1}
                            >
                                Upload
                            </Upload>
                        </ImgCrop>
                    </Form.Item>
                    <Form.Item style={{ paddingTop: 20 }}>
                        <Button type="primary" htmlType="submit" className="login-form-button" size="large" style={{ width: "100%" }}>
                            Cập nhật thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            }

        </Flex>
    );
}

export default UpdateSong;
