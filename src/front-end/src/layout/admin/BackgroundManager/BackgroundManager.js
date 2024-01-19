
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import { Button, Table, Flex, Breadcrumb, message, Avatar, Modal, Form, Input, Upload, Spin, Select, Image, Tag } from 'antd';
import axios from 'axios';
import { FireOutlined, LockOutlined, MailOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Link } from 'react-router-dom';



function BackgroundManager() {

    const [open, setOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [users, setUsers] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const [fileList, setFileList] = useState([]);

    const successMessage = (msg) => {
        messageApi.open({
            key: 'login',
            type: 'success',
            content: msg
        });
    };

    const errorMessage = (msg) => {
        messageApi.open({
            key: 'login',
            type: 'error',
            content: msg
        });
    };

    const columns = [
        {
            title: 'Ảnh nền',
            dataIndex: 'image',
            width: 200,
            render: (text) => <Image src={text} width={150} style={{ borderRadius: 5 }} />
        },
        {
            title: 'Tên ảnh nền',
            dataIndex: 'name',
            render: (text) => <h3>{text}</h3>
        },
        {
            title: 'Loại ảnh nền',
            dataIndex: 'premium',
            render: (premium) => <Tag color={premium ? "#f50" : "#00CC77"}>{premium ? "Premium" : "Free"}</Tag>,
            filters: [
                {
                    value: true,
                    text: "Premium"
                },
                {
                    value: false,
                    text: "Free"
                }
            ]
            ,
            onFilter: (value, record) => record.premium === value
        },
        {
            title: 'Sửa',
            dataIndex: 'update',
            render: (_id) =>
                <Link to={`update/${_id}`}>
                    <i className="fa-solid fa-pen-to-square" style={{ color: "#1677ff", fontSize: "18px" }}></i>
                </Link>,
            width: 60,
            align: "center"
        }
    ];

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
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

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const showModal = () => {
        setOpen(true);
    };

    const showDeleteConfirm = () => {
        setOpenDeleteConfirm(true);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onFinish = async (values) => {

        setSpinning(true);
        setOpen(false);

        if (fileList[0]) {

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

                            const newUser = {
                                "name": values.name,
                                "image": downloadURL,
                                "premium_only": values.premium_only
                            }

                            axios.post(`http://localhost:3005/api/backgrounds`, newUser, {
                                withCredentials: true
                            })
                                .then(response => {
                                    // console.log(response.data);
                                    successMessage("Thêm thành công");
                                    fetchData();
                                })
                                .catch(error => {
                                    console.error('Error fetching data:', error);
                                    errorMessage("Thêm thất bại");
                                });

                            setSpinning(false);

                        });
                    }
                );
            } catch (error) {
                console.error('Image Compression Error:', error);
            }
        } else {
            try {
                const newUser = {
                    "name": values.name,
                    "premium_only": values.premium_only
                }

                axios.post(`http://localhost:3005/api/backgrounds`, newUser, {
                    withCredentials: true
                })
                    .then(response => {
                        // console.log(response.data);
                        successMessage("Thêm thành công");
                        fetchData();
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        errorMessage("Thêm thất bại");
                    });

                setSpinning(false);
            } catch (error) {

            }
        }

    };

    const handleDelete = () => {

        setSpinning(true);
        setOpenDeleteConfirm(false);

        const dataKey = {
            backgroundIds: selectedRowKeys
        }

        axios.delete(`http://localhost:3005/api/backgrounds/multiple`, {
            data: dataKey,
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                successMessage("Xoá thành công");
                fetchData();
                setSpinning(false);
                setSelectedRowKeys([]);
            })
            .catch(error => {
                console.log(error);
                errorMessage("Xoá thất bại");
            });
    }

    const fetchData = () => {
        axios.get(`http://localhost:3005/api/backgrounds`, {
            withCredentials: true
        })
            .then(response => {

                // console.log(response.data);

                const dataFormatted = response.data.map(data => {
                    return ({
                        key: data._id,
                        name: data.name,
                        image: data.image,
                        premium: data.premium_only,
                        update: data._id
                    })
                })

                // console.log(dataFormatted);

                setUsers(dataFormatted);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Flex className="BackgroundManager" vertical={true} gap={20} style={{ position: "relative" }}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
                    },
                    {
                        title: 'Quản lý hình nền',
                    },
                ]}
            />
            <Flex>
                <Button type="primary" onClick={showModal}>Thêm hình nền mới</Button>
            </Flex>
            {
                selectedRowKeys.length !== 0 &&
                <Flex align='center' justify='space-between'
                    style={{
                        padding: "10px 15px",
                        borderRadius: "5px",
                        backgroundColor: "white",
                        boxShadow: "0 0 15px rgba(0, 0, 0, 0.15)",
                        position: "sticky",
                        top: "10px",
                        zIndex: "10"
                    }}
                >
                    <span>Đã chọn {selectedRowKeys.length} hình nền</span>
                    <Button type='primary' danger onClick={showDeleteConfirm}>Xoá</Button>
                </Flex>
            }
            <Table rowSelection={rowSelection} columns={columns} dataSource={users} bordered={true} />
            <Modal
                open={openDeleteConfirm}
                title="Xác nhận xoá"
                onOk={() => setOpenDeleteConfirm(false)}
                onCancel={() => setOpenDeleteConfirm(false)}
                footer={[
                    <Button key="back" onClick={() => setOpenDeleteConfirm(false)}>
                        Quay lại
                    </Button>,
                    <Button key="submit" type="primary" danger onClick={handleDelete}>
                        Xoá
                    </Button>
                ]}
                centered
            >
                <p>{selectedRowKeys.length} hình nền sẽ bị xoá vĩnh viễn? Vẫn tiếp tục?</p>
            </Modal>
            <Modal
                open={open}
                title="Thêm hình nền mới"
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                footer={[
                ]}
                width={400}
                centered
            >
                <Form
                    name="reflow_login"
                    className="login-form"
                    initialValues={{
                        role: "Free",
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Tên hình nền"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên hình nền!',
                            },
                        ]}
                    >
                        <Input placeholder="Tên ca sĩ" allowClear />
                    </Form.Item>
                    <Form.Item
                        name="premium_only"
                        label="Loại hình nền"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn loại!',
                            },
                        ]}
                    >
                        <Select placeholder="Loại hình nền" prefix={<FireOutlined className="site-form-item-icon" />} allowClear>
                            <Select.Option value={false}>Free</Select.Option>
                            <Select.Option value={true}>Premium</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            maxCount={1}
                        >
                            Upload
                        </Upload>
                    </Form.Item>
                    <Form.Item style={{ paddingTop: 20 }}>
                        <Button type="primary" htmlType="submit" className="login-form-button" size="medium" style={{ width: "100%" }}>
                            Thêm hình nền
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
}

export default BackgroundManager;
