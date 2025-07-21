import React from "react";

const Save = ({ onClick }) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <button
        onClick={onClick}
        className="btn rounded-lg bg-btnBg text-white h-[41px] mb-2"
      >
        Save Order
      </button>
    </div>
  );
};

export default Save;
