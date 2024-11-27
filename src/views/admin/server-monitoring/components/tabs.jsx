import React, { useState } from 'react';

export const Tabs = ({ defaultValue, children, className }) => {
    const [selected, setSelected] = useState(defaultValue);
    return (
        <div className={className}>
            {children.map(child =>
                child.type === TabsList
                    ? React.cloneElement(child, { selected, setSelected })
                    : React.cloneElement(child, { selected })
            )}
        </div>
    );
};

export const TabsList = ({ children, selected, setSelected }) => (
    <div className="flex space-x-4">
        {children.map(child =>
            React.cloneElement(child, { selected, setSelected })
        )}
    </div>
);

export const TabsTrigger = ({ value, selected, setSelected, children }) => (
    <button
        className={`py-2 px-4 rounded ${selected === value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setSelected(value)}
    >
        {children}
    </button>
);

export const TabsContent = ({ value, selected, children, className }) => (
    selected === value ? <div className={className}>{children}</div> : null
);
