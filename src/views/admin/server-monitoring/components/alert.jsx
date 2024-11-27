import React from 'react';

export const Alert = ({ variant, children, className }) => (
    <div className={`border-l-4 p-4 ${variant === 'destructive' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-blue-100 border-blue-500 text-blue-700'} ${className}`}>
        {children}
    </div>
);

export const AlertTitle = ({ children }) => (
    <p className="font-bold">{children}</p>
);

export const AlertDescription = ({ children }) => (
    <p>{children}</p>
);

