
import { Breadcrumb } from 'antd';

function CategoryManager() {
    return (
        <div className="CategoryManager">
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
                    },
                    {
                        title: 'Quản lý thể loại',
                    },
                ]}
            />
        </div>
    );
}

export default CategoryManager;
