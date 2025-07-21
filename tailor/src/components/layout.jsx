
import React from "react";
import Sidebar from "../components/Sidebar";

const Layout = ({ children, handleVarietyClick, selectedVariety, hideSidebar }) => {
  return (
    <div className="flex-start">
      {!hideSidebar && (
        <Sidebar
          handleVarietyClick={handleVarietyClick}
          selectedVariety={selectedVariety}
        />
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;