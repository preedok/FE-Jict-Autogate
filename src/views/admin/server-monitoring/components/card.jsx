import React from 'react';

export const Card = ({ children }) => (
    <div className="bg-white shadow-md rounded-lg p-5">{children}</div>
);

export const CardHeader = ({ children, className }) => (
    <div className={`p-4 rounded-md border-b bg-[#f3f4f7] ${className}`}>{children}</div>
);

export const CardTitle = ({ children }) => (
    <h2 className="text-lg font-semibold">{children}</h2>
);

export const CardContent = ({ children }) => (
    <div className="pt-2">{children}</div>
);

