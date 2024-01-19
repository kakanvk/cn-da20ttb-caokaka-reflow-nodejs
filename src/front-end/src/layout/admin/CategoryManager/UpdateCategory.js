
import { FireOutlined, LockOutlined, MailOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Form, Input, Select, Spin, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Link, useNavigate, useParams } from 'react-router-dom';

function UpdateCategory() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [userData, setUserData] = useState();
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
        axios.put(`http://localhost:3005/api/categorys/${id}`, newData, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                successMessage();
                setSpinning(true);
                setTimeout(() => {
                    navigate('/admin/categories');
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

                            const newUserData = {
                                "name": values.name,
                                "image": downloadURL
                            }

                            handleUpdateById(newUserData);

                            setSpinning(false);

                        });
                    }
                );
            } catch (error) {
                console.error('Image Compression Error:', error);
            }
        } else {
            try {
                const newUserData = {
                    "name": values.name
                }

                handleUpdateById(newUserData);

                setSpinning(false);
            } catch (error) {

            }
        }

    };

    const fecthUserData = async () => {
        setSpinning(true);
        axios.get(`http://localhost:3005/api/categorys/${id}`, {
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                setUserData(response.data);
                setFileList([
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: response.data.image,
                    }
                ])
                setSpinning(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        fecthUserData();
    }, [])

    return (
        <Flex className="UpdateCategory" vertical gap={20}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
                    },
                    {
                        title: <Link to="/admin/categories">Quản lý thể loại</Link>,
                    },
                    {
                        title: 'Cập nhật',
                    },
                    {
                        title: userData?.name,
                    },
                ]}
            />
            {
                userData &&
                <Form
                    name="reflow_login"
                    className="login-form"
                    style={{
                        width: "400px",
                        margin: "0 auto",
                    }}
                    initialValues={{
                        name: userData.name,
                        avatar: userData.image
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Tên ca sĩ"
                    >
                        <Input placeholder="Họ và tên" allowClear size="large" />
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                    >
                        <Upload
                            listType="picture-card"
                            defaultFileList={fileList}
                            valuePropName="avatar"
                            onChange={onChange}
                            maxCount={1}
                        >
                            Upload
                        </Upload>
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

export default UpdateCategory;
