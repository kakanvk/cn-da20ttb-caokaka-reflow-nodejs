
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import { Button, Table, Flex, Breadcrumb, Badge, Avatar, Modal, Form, Input, Upload, Spin, Image } from 'antd';
import axios from 'axios';
import { FireOutlined, LockOutlined, MailOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Link } from 'react-router-dom';

function CategoryManager() {

    const [open, setOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const [fileList, setFileList] = useState([]);

    const columns = [
        {
            title: 'Tên hình nền',
            dataIndex: 'name',
            render: (record) =>
                <Flex align='center' gap={10}>
                    <Image src={record.avatar} width={60} style={{ borderRadius: 5 }} />
                    <h4 style={{ fontWeight: 500 }}>{record.name}</h4>
                </Flex>
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
                            }

                            axios.post(`http://localhost:3005/api/categorys`, newUser, {
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
                }

                axios.post(`http://localhost:3005/api/categorys`, newUser, {
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
            ids: selectedRowKeys
        }

        axios.delete(`http://localhost:3005/api/categorys/multiple`, {
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
        axios.get(`http://localhost:3005/api/categorys`, {
            withCredentials: true
        })
            .then(response => {

                // console.log(response.data);

                const dataFormatted = response.data.map(data => {
                    return ({
                        key: data._id,
                        name: { name: data.name, avatar: data.image },
                        update: data._id
                    })
                })

                // console.log(dataFormatted);

                setCategorys(dataFormatted);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Flex className="CategoryManager" vertical={true} gap={20} style={{ position: "relative" }}>
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
            <Table rowSelection={rowSelection} columns={columns} dataSource={categorys} bordered={true} />
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
                        <Input placeholder="Tên hình nền" allowClear />
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

export default CategoryManager;
