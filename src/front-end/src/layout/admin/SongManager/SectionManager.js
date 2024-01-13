
import React, { useEffect, useState } from 'react';
import { Button, Table, Flex, Breadcrumb, Modal, Form, Input, Spin, Select, message } from 'antd';
import axios from 'axios';
import { FireOutlined, MenuOutlined, NumberOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';

import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


function SectionManager() {

    const { id } = useParams();

    const [open, setOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [song, setSong] = useState();
    const [sections, setSections] = useState([]);
    const [spinning, setSpinning] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const [isDraged, setIsDraged] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const successMessage = (msg) => {
        messageApi.open({
            key: 'login',
            type: 'success',
            content: msg,
        });
    };

    const errorMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'error',
            content: 'Tạo đoạn mới thất bại',
        });
    };

    const columns = [
        {
            title: <NumberOutlined />,
            key: 'sort',
            align: "center",
            width: 50
        },
        {
            title: 'Tên đoạn',
            dataIndex: 'name',
            width: 150,
            filters: [
                { text: 'Verse', value: 'Verse' },
                { text: 'Chorus', value: 'Chorus' },
                { text: 'Bridge', value: 'Bridge' },
                { text: 'Rap', value: 'Rap' },
                { text: 'Orther', value: 'Orther' },
            ],
            onFilter: (value, record) => record.name.indexOf(value) === 0
        },
        {
            title: 'Nội dung',
            dataIndex: 'lyrics',
            render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text?.replace(/<br\/>/g, '\n')}</div>
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

    const Row = ({ children, ...props }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            setActivatorNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({
            id: props['data-row-key'],
        });
        const style = {
            ...props.style,
            transform: CSS.Transform.toString(
                transform && {
                    ...transform,
                    scaleY: 1,
                },
            ),
            transition,
            ...(isDragging
                ? {
                    position: 'relative',
                    zIndex: 99,
                }
                : {}),
        };
        return (
            <tr {...props} ref={setNodeRef} style={style} {...attributes}>
                {React.Children.map(children, (child) => {
                    if (child.key === 'sort') {
                        return React.cloneElement(child, {
                            children: (
                                <MenuOutlined
                                    ref={setActivatorNodeRef}
                                    style={{
                                        touchAction: 'none',
                                        cursor: 'move',
                                    }}
                                    {...listeners}
                                />
                            ),
                        });
                    }
                    return child;
                })}
            </tr>
        );
    };

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setSections((previous) => {
                const activeIndex = previous.findIndex((i) => i.key === active.id);
                const overIndex = previous.findIndex((i) => i.key === over?.id);
                return arrayMove(previous, activeIndex, overIndex);
            });
            setIsDraged(true);
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
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

        console.log(values);

        setSpinning(true);
        setOpen(false);


        try {
            const newSection = {
                "name": values.name,
                "lyrics": values.lyrics,
            }

            axios.post(`http://localhost:3005/api/songs/addSection/${id}`, newSection, {
                withCredentials: true
            })
                .then(response => {
                    // console.log(response.data);
                    fetchData();
                    successMessage("Tạo đoạn mới thành công")
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    errorMessage();
                });

            setSpinning(false);
        } catch (error) {

        }
    };

    const handleDelete = () => {

        setSpinning(true);
        setOpenDeleteConfirm(false);

        const dataKey = {
            sectionIds: selectedRowKeys
        }

        axios.delete(`http://localhost:3005/api/songs/${id}/sections/multiple`, {
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

    const handleSaveSectionDraged = () => {

        const newSections = sections.map(section => {
            return ({
                _id: section.key,
                name: section.name,
                lyrics: section.lyrics,
                order: section.order
            })
        })

        axios.put(`http://localhost:3005/api/songs/${id}`, {
            "sections": newSections
        }, {
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                fetchData();
                successMessage("Đã lưu lại thay đổi")
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                errorMessage();
            });

        setIsDraged(false);
    }

    const fetchData = () => {
        axios.get(`http://localhost:3005/api/songs/${id}`, {
            withCredentials: true
        })
            .then(response => {

                console.log(response.data);
                setSong(response.data);

                const dataFormatted = response.data.sections.map(data => {
                    return ({
                        key: data._id,
                        name: data.name,
                        lyrics: data.lyrics,
                        update: data._id,
                        order: data.order
                    })
                })

                // console.log(dataFormatted);

                setSections(dataFormatted);
            })
            .catch(error => {
                console.log(error);
            });

        setIsDraged(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Flex className="SectionManager" vertical={true} gap={20} style={{ position: "relative" }}>
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
                        title: song?.title,
                    },
                ]}
            />
            <Flex gap={10}>
                <Button type="primary" onClick={showModal}>Thêm đoạn mới</Button>
                {
                    isDraged &&
                    <>
                        <Button type="primary" styles={{ background: "red" }} onClick={() => handleSaveSectionDraged()}>Lưu thay đổi</Button>
                        <Button onClick={() => fetchData()}>Huỷ</Button>
                    </>
                }
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
                    <span>Đã chọn {selectedRowKeys.length} đoạn</span>
                    <Button type='primary' danger onClick={showDeleteConfirm}>Xoá</Button>
                </Flex>
            }
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={sections.map((i) => i.key)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        components={{
                            body: {
                                row: Row,
                            },
                        }}
                        rowKey="key"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={sections}
                        bordered={true} />
                </SortableContext>
            </DndContext>
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
                <p>{selectedRowKeys.length} đoạn sẽ bị xoá vĩnh viễn? Vẫn tiếp tục?</p>
            </Modal>
            <Modal
                open={open}
                title="Thêm đoạn bài hát mới"
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                footer={[
                ]}
                width={600}
                centered
            >
                <Form
                    name="reflow_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn đoạn!',
                            },
                        ]}
                    >
                        <Select placeholder="Đoạn" prefix={<FireOutlined className="site-form-item-icon" />}>
                            <Select.Option value="Verse">Verse</Select.Option>
                            <Select.Option value="Chorus">Chorus</Select.Option>
                            <Select.Option value="Bridge">Bridge</Select.Option>
                            <Select.Option value="Rap">Rap</Select.Option>
                            <Select.Option value="Orther">Orther</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="lyrics"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lời bài hát!',
                            },
                        ]}
                    >
                        <Input.TextArea rows={6} placeholder="Lời bài hát" allowClear inputMode='multiple' />
                    </Form.Item>
                    <Form.Item style={{ paddingTop: 20 }}>
                        <Button type="primary" htmlType="submit" className="login-form-button" size="medium" style={{ width: "100%" }}>
                            Tạo đoạn
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
}

export default SectionManager;
