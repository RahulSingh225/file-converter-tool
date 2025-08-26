import React from 'react';

const Card = ({ children, title }) => (
  <div className="p-4 border rounded bg-white shadow-sm">
    {title && <div className="font-medium mb-2">{title}</div>}
    <div>{children}</div>
  </div>
);

export default Card;
