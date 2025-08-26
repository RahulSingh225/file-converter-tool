import React from 'react';

const Loader = ({ size = 8 }) => (
  <div className="flex items-center justify-center">
    <div className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-blue-600`} />
  </div>
);

export default Loader;
