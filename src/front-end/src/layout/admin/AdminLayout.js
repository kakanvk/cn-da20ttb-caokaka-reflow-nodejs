import { useEffect, useState } from 'react';
import {
    DesktopOutlined,
    AudioOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    ExportOutlined,
} from '@ant-design/icons';
import { Flex, Layout, Menu } from 'antd';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import CategoryManager from './CategoryManager/CategoryManager';
import axios from 'axios';
import UserManager from './UserManager/UserManager';
import UpdateUser from './UserManager/UpdateUser';
import SongManager from './SongManager/SongManager';
import UpdateSong from './SongManager/UpdateSong';
import SectionManager from './SongManager/SectionManager';
import UpdateSection from './SongManager/UpdateSection';
import SingerManager from './SingerManager/SingerManager';
import UpdateSinger from './SingerManager/UpdateSinger';
import UpdateCategory from './CategoryManager/UpdateCategory';
const { Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem(<Link to="/admin">Tổng quan</Link>, 'overview', <PieChartOutlined />),
    getItem(<Link to="/admin/users">Quản lý người dùng</Link>, 'users', <UserOutlined />),
    getItem(<Link to="/admin/categories">Quản lý thể loại</Link>, 'categories', <DesktopOutlined />),
    getItem(<Link to="/admin/singers">Quản lý ca sĩ</Link>, 'singers', <TeamOutlined />),
    getItem(<Link to="/admin/songs">Quản lý bài hát</Link>, 'songs', <AudioOutlined />),
];

const AdminLayout = () => {

    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [currentUser, setCurrentUser] = useState();

    const fecthUserData = () => {
        axios.get(`http://localhost:3005/api/users/info`, {
            withCredentials: true
        })
            .then(response => {
                // console.log(response.data);
                if (response.data.role !== "Admin") {
                    navigate('/');
                }
                setCurrentUser(response.data);
            })
            .catch(error => {
                console.log(error);
                navigate('/');
            });
    }

    useEffect(() => {

        fecthUserData();

    }, [])

    return (
        <div>
            {
                currentUser &&
                <Layout
                    style={{
                        minHeight: '100vh',
                    }}
                >
                    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={260}>
                        <Flex className="demo-logo-vertical" style={{ color: "white", padding: "20px" }} justify={!collapsed ? "space-between" : "center"}>
                            {!collapsed && <h2>REFLOW</h2>}
                            <Link to="/" target='blank'><ExportOutlined style={{ color: "white" }}/></Link>
                        </Flex>
                        <Menu theme="dark" defaultSelectedKeys={['overview']} mode="inline" items={items} />
                    </Sider>
                    <Layout style={{ padding: "20px 30px", height: "100vh", overflowY: "auto"}}>
                        <Routes>
                            <Route path="users" element={<UserManager />} />
                            <Route path="users/update/:id" element={<UpdateUser />} />
                            <Route path="categories" element={<CategoryManager />} />
                            <Route path="categories/update/:id" element={<UpdateCategory />} />
                            <Route path="singers" element={<SingerManager />} />
                            <Route path="singers/update/:id" element={<UpdateSinger />} />
                            <Route path="songs" element={<SongManager />} />
                            <Route path="songs/section/:id" element={<SectionManager />} />
                            <Route path="songs/section/:id/update/:sectionId" element={<UpdateSection />} />
                            <Route path="songs/update/:id" element={<UpdateSong />} />
                        </Routes>
                    </Layout>
                </Layout>
            }
        </div>
    );
};
export default AdminLayout;