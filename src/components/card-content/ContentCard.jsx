import React from "react";

const ContentCard = ({ children }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-md sm:p-6 md:p-8 lg:p-10 xl:p-12">
      {children}
    </div>
  );
}

export default ContentCard;
