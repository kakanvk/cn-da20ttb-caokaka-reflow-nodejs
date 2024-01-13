
import { FireOutlined, LockOutlined, MailOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Form, Input, Select, Spin, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Link, useNavigate, useParams } from 'react-router-dom';

function UpdateSection() {

    const { id, sectionId } = useParams();
    const navigate = useNavigate();

    const [sectionData, setSectionData] = useState();
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [SongData, setSongData] = useState();
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
        axios.put(`http://localhost:3005/api/songs/${id}/sections/${sectionId}`, newData, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                successMessage();
                setSpinning(true);
                setTimeout(() => {
                    navigate(`/admin/songs/section/${id}`);
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

        try {
            const newSongData = {
                "name": values.name,
                "lyrics": values.lyrics.replace(/\n/g, '<br/>')
            }

            handleUpdateById(newSongData);

            setSpinning(false);
        } catch (error) {

        }

    };

    const fecthSongData = async () => {
        setSpinning(true);

        try {
            const [songResponse, sectionResponse] = await Promise.all([
                axios.get(`http://localhost:3005/api/songs/${id}`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/songs/${id}/sections/${sectionId}`, { withCredentials: true }),
            ]);

            setSongData(songResponse.data);
            setSectionData(sectionResponse.data);

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
        <Flex className="UpdateSection" vertical gap={20}>
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
                        title: <Link to={`/admin/songs/section/${SongData?._id}`}>{SongData?.title}</Link>,
                    },
                    {
                        title: 'Cập nhật đoạn nhạc',
                    },
                ]}
            />
            {
                SongData &&
                <Form
                    name="reflow_login"
                    className="login-form"
                    style={{
                        width: "600px",
                        margin: "0 auto",
                    }}
                    initialValues={{
                        name: sectionData.name,
                        lyrics: sectionData.lyrics?.replace(/<br\/>/g, '\n'),
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Đoạn"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn đoạn!',
                            },
                        ]}
                    >
                        <Select placeholder="Loại tài khoản" size="large" allowClear>
                            <Select.Option value="Verse">Verse</Select.Option>
                            <Select.Option value="Chorus">Chorus</Select.Option>
                            <Select.Option value="Bridge">Bridge</Select.Option>
                            <Select.Option value="Rap">Rap</Select.Option>
                            <Select.Option value="Orther">Orther</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="lyrics"
                        label="Lời bài hát"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lời bài hát!',
                            },
                        ]}
                    >
                        <Input.TextArea rows={10} placeholder="Lời bài hát" allowClear inputMode='multiple' />
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

export default UpdateSection;
