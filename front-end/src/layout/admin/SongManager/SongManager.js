
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import { Button, Table, Flex, Breadcrumb, Badge, Avatar, Modal, Form, Input, Upload, Spin, Select, message, Image } from 'antd';
import axios from 'axios';
import { FireOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Link } from 'react-router-dom';



function SongManager() {

    const [open, setOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [songs, setSongs] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const [categorys, setCategorys] = useState([]);
    const [singers, setSingers] = useState([]);

    const [fileList, setFileList] = useState([]);


    const [messageApi, contextHolder] = message.useMessage();

    const successMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'success',
            content: 'Tạo bài hát thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'error',
            content: 'Tạo bài hát thất bại',
        });
    };

    const columns = [
        {
            title: 'Tên bài hát',
            dataIndex: 'name',
            render: (record) =>
                <Flex align='center' justify='space-between'>
                    <Flex align='center' gap={10}>
                        <Image shape="square" src={record.image} width={50} style={{borderRadius: 5}}/>
                        <h4 style={{ fontWeight: 500 }}>{record.title}</h4>
                    </Flex>
                    <Link to={`section/${record._id}`}>
                        <Button size='small'>Chi tiết</Button>
                    </Link>
                </Flex>
        },
        {
            title: 'Ca sĩ',
            dataIndex: 'singer',
            filters:
                singers.map((singer) => {
                    return (
                        {
                            value: singer.name,
                            text: singer.name
                        }
                    )
                })
            ,
            onFilter: (value, record) => record.singer.indexOf(value) === 0
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            render: (role) => <Badge color="#00CC77" count={role} />,
            filters:
                categorys.map((category) => {
                    return (
                        {
                            value: category.name,
                            text: category.name
                        }
                    )
                })
            ,
            onFilter: (value, record) => record.category.indexOf(value) === 0
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

    const handleCreateSong = (songData) => {
        axios.post(`http://localhost:3005/api/songs`, songData, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                successMessage();
                fetchData();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                errorMessage();
            });
    }

    const onFinish = async (values) => {

        setSpinning(true);
        setOpen(false);

        console.log(values);
        console.log(fileList);

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

                            const newSong = {
                                "title": values.title,
                                "image": downloadURL,
                                "singerId": values.singer,
                                "categoryId": values.category,
                            }

                            handleCreateSong(newSong);

                            setSpinning(false);

                        });
                    }
                );
            } catch (error) {
                console.error('Image Compression Error:', error);
            }
        } else {
            try {
                const newSong = {
                    "title": values.title,
                    "singerId": values.singer,
                    "categoryId": values.category,
                }

                handleCreateSong(newSong);

                setSpinning(false);
            } catch (error) {

            }
        }


    };

    const handleDelete = () => {

        setSpinning(true);
        setOpenDeleteConfirm(false);

        const dataKey = {
            songIds: selectedRowKeys
        }

        axios.delete(`http://localhost:3005/api/songs/multiple`, {
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

    const fetchData = async () => {
        setSpinning(true);

        try {
            const [songResponse, categoryResponse, singerResponse] = await Promise.all([
                axios.get(`http://localhost:3005/api/songs`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/categorys`, { withCredentials: true }),
                axios.get(`http://localhost:3005/api/singers`, { withCredentials: true }),
            ]);

            const dataFormatted = songResponse.data.map(data => {
                return ({
                    key: data._id,
                    name: { _id: data._id, title: data.title, image: data?.image },
                    singer: data.singerId?.name,
                    category: data.categoryId?.name,
                    update: data._id
                })
            })

            setSongs(dataFormatted);
            setCategorys(categoryResponse.data);
            setSingers(singerResponse.data);

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
        <Flex className="SongManager" vertical={true} gap={20} style={{ position: "relative" }}>
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
                    },
                    {
                        title: 'Quản lý bài hát',
                    },
                ]}
            />
            <Flex>
                <Button type="primary" onClick={showModal}>Thêm bài hát</Button>
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
                    <span>Đã chọn {selectedRowKeys.length} bài hát</span>
                    <Button type='primary' danger onClick={showDeleteConfirm}>Xoá</Button>
                </Flex>
            }
            <Table rowSelection={rowSelection} columns={columns} dataSource={songs} bordered={true} />
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
                <p>{selectedRowKeys.length} bài hát sẽ bị xoá vĩnh viễn? Vẫn tiếp tục?</p>
            </Modal>
            <Modal
                open={open}
                title="Thêm bài hát mới"
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                footer={[
                ]}
                width={430}
                centered
            >
                <Form
                    name="reflow_login"
                    className="login-form"
                    style={{
                        margin: "0 auto",
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Tên bài hát"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên bài hát!',
                            },
                        ]}
                    >
                        <Input placeholder="Tên bài hát" allowClear size="large" />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Thể loại"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn thể loại!',
                            },
                        ]}
                    >
                        <Select placeholder="Thể loại" prefix={<FireOutlined className="site-form-item-icon" />} size="large" allowClear>
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
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ca sĩ!',
                            },
                        ]}
                    >
                        <Select placeholder="Loại sa sĩ" prefix={<FireOutlined className="site-form-item-icon" />} size="large" allowClear>
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
                        name="image"
                    >
                        <ImgCrop showGrid>
                            <Upload
                                listType="picture-card"
                                defaultFileList={fileList}
                                valuePropName="image"
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
                            Thêm bài hát
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
}

export default SongManager;
