import React from 'react';

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {title && (
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h1>
        </header>
      )}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
