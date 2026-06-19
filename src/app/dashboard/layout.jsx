import React from 'react';

const DashboardLayout = ({children}) => {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;