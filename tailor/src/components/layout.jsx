import React from "react";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-auto bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
};

export default Layout;
