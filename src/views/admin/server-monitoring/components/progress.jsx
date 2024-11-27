import React from 'react';

export const Progress = ({ value, className }) => (
    <div className={`relative h-4 rounded-full bg-gray-200 overflow-hidden ${className}`}>
        <div
            className="absolute top-0 left-0 h-full bg-blue-500"
            style={{ width: `${value}%` }}
        ></div>
    </div>
);
