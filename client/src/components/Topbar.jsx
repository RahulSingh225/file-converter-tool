import React from 'react';

const Topbar = ({ title }) => (
  <header className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold">{title}</h1>
    <div className="text-sm text-gray-600">v1.0</div>
  </header>
);

export default Topbar;
