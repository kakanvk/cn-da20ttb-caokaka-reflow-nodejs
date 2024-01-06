
import { Breadcrumb } from 'antd';

function SingerManager() {
    return (
        <div className="SingerManager">
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
                    },
                    {
                        title: 'Quản lý ca sĩ',
                    },
                ]}
            />
        </div>
    );
}

export default SingerManager;
