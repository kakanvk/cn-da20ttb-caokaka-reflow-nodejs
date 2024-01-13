
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import { Button, Table, Flex, Breadcrumb, Badge, Avatar, Modal, Form, Input, Upload, Spin, Select, Image } from 'antd';
import axios from 'axios';
import { FireOutlined, LockOutlined, MailOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Link } from 'react-router-dom';



function UserManager() {

    const [open, setOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [users, setUsers] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const [fileList, setFileList] = useState([]);

    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            render: (record) =>
                <Flex align='center' gap={10}>
                    <Image src={record.avatar} width={40} style={{borderRadius: 30}}/>
                    <h4 style={{ fontWeight: 600 }}>{record.name}</h4>
                </Flex>
        },
        {
            title: 'Username',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Tài khoản',
            dataIndex: 'role',
            render: (role) => <Badge color={role === "Free" ? "#00CC77" : role === "Premium" ? "#ff6600" : "black"} count={role} />,
            filters: [
                { text: 'Free', value: 'Free' },
                { text: 'Premium', value: 'Premium' },
                { text: 'Admin', value: 'Admin' },
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0
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
                                "avatar": downloadURL,
                                "username": values.username,
                                "password": values.password,
                                "role": values.role,
                                "email": values.email
                            }

                            axios.post(`http://localhost:3005/api/auth/register`, newUser, {
                                withCredentials: true
                            })
                                .then(response => {
                                    // console.log(response.data);
                                    fetchData();
                                })
                                .catch(error => {
                                    console.error('Error fetching data:', error);
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
                    "username": values.username,
                    "password": values.password,
                    "role": values.role,
                    "email": values.email
                }

                axios.post(`http://localhost:3005/api/auth/register`, newUser, {
                    withCredentials: true
                })
                    .then(response => {
                        // console.log(response.data);
                        fetchData();
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
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
            userIds: selectedRowKeys
        }

        axios.delete(`http://localhost:3005/api/users/multiple`, {
            data: dataKey,
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                fetchData();
                setSpinning(false);
                setSelectedRowKeys([]);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const fetchData = () => {
        axios.get(`http://localhost:3005/api/users`, {
            withCredentials: true
        })
            .then(response => {

                // console.log(response.data);

                const dataFormatted = response.data.map(data => {
                    return ({
                        key: data._id,
                        name: { name: data.name, avatar: data.avatar },
                        email: data.email,
                        role: data.role,
                        username: data.username,
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
        <Flex className="UserManager" vertical={true} gap={20} style={{ position: "relative" }}>
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
                    },
                    {
                        title: 'Quản lý người dùng',
                    },
                ]}
            />
            <Flex>
                <Button type="primary" onClick={showModal}>Thêm người dùng</Button>
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
                    <span>Đã chọn {selectedRowKeys.length} người dùng</span>
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
                <p>{selectedRowKeys.length} người dùng sẽ bị xoá vĩnh viễn? Vẫn tiếp tục?</p>
            </Modal>
            <Modal
                open={open}
                title="Thêm người dùng mới"
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
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ và tên!',
                            },
                        ]}
                    >
                        <Input prefix={<SmileOutlined className="site-form-item-icon" />} placeholder="Họ và tên" allowClear />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" allowClear />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên đăng nhập!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" allowClear />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Mật khẩu"
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn quyền!',
                            },
                        ]}
                    >
                        <Select placeholder="Loại tài khoản" prefix={<FireOutlined className="site-form-item-icon" />}>
                            <Select.Option value="Free">Free</Select.Option>
                            <Select.Option value="Premium">Premium</Select.Option>
                            <Select.Option value="Admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                    >
                        <ImgCrop showGrid>
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                                maxCount={1}
                            >
                                Upload
                            </Upload>
                        </ImgCrop>
                    </Form.Item>
                    <Form.Item style={{ paddingTop: 20 }}>
                        <Button type="primary" htmlType="submit" className="login-form-button" size="medium" style={{ width: "100%" }}>
                            Tạo người dùng
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
}

export default UserManager;
