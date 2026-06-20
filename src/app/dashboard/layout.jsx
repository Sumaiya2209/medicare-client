import { DashBoardSideBar} from '@/components/dashboard/DashboardSideBar';
import React from 'react';

const DashboardLayout = ({children}) => {
    return (
        <div className="flex min-h-screen">
            <DashBoardSideBar />
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default DashboardLayout;