
import "./Logup.css"
import { LockOutlined, MailOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Spin } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";

function Logup() {

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const [spinning, setSpinning] = useState(false);

    const successMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'success',
            content: 'Đăng ký thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            key: 'login',
            type: 'error',
            content: 'Tên đăng nhập đã tồn tại',
        });
    };

    const onFinish = (values) => {

        axios.post(`http://localhost:3005/api/auth/register`, {
            name: values.name,
            email: values.email,
            username: values.username,
            password: values.password
        }, {
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);
                setTimeout(() => {
                    successMessage();
                }, 1000)
                setSpinning(true);
                setTimeout(() => {
                    setSpinning(false);

                    const stateData = {
                        action: "register",
                        username: values.username,
                        password: values.password
                    }

                    navigate('/login', { state: stateData });
                }, 2000);
            })
            .catch(error => {
                // console.error('Error fetching data:', error);
                setTimeout(() => {
                    errorMessage();
                }, 1000)
                setSpinning(true);
                setTimeout(() => {
                    setSpinning(false);
                }, 2000);
            });
    };

    return (
        <div className="Logup">
            {contextHolder}
            <Spin spinning={spinning} fullscreen />
            <Form
                name="reflow_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                style={{ width: 350 }}
            >
                <Form.Item >
                    <h1 style={{ textAlign: "center", fontSize: "20px" }}>ĐĂNG KÝ</h1>
                </Form.Item>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập họ và tên!',
                        },
                    ]}
                >
                    <Input prefix={<SmileOutlined className="site-form-item-icon" />} placeholder="Họ và tên" size="large" allowClear />
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
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" size="large" allowClear />
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
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập" size="large" allowClear />
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
                        size="large"
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Tôi đồng ý với các điều khoản dịch vụ</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" size="large" style={{ width: "100%" }}>
                        Đăng ký
                    </Button>
                </Form.Item>
                <Form.Item>
                    Đã có tài khoản? <Link to="/login">Đăng nhập!</Link>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Logup;
