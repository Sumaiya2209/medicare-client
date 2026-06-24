import { DashBoardSideBar } from '@/components/dashboard/DashboardSideBar';
import React from 'react';
import { Toaster } from "react-hot-toast";


const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <DashBoardSideBar />
            <div className="flex-1">
                {children}
                <Toaster position="top-right" className="text-blue-950"/>
            </div>
        </div>
    );
};

export default DashboardLayout;