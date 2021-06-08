import React from "react";

const Brand = ({ children }) => {
  return (
    <div className="flex items-center justify-between brand-area">
      <div className="flex items-center brand">
        <span className="brand__text">Nudolio - Dashboard</span>
      </div>
      {children}
    </div>
  );
};

export default Brand;
