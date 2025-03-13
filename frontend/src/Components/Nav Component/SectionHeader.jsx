import React from "react";

const SectionHeader = ({ title }) => {
  return (
    <div className="relative w-full h-[63px] flex items-center">
      {/* Dark Blue Main Section */}
      <div className="w-full h-full bg-[#2b2c6c] relative flex items-center justify-center">
        
        {/* Pink Left Triangle */}
        <div
          className="absolute left-0 w-[70px] h-full bg-[#E6317D]"
          style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
        ></div>

        {/* Green Right Section (Extends Further Left Only at Bottom) */}
        <div
          className="absolute right-0 w-[35%] h-full bg-[#2FB297]"
          style={{ clipPath: "polygon(20% 100%, 100% 100%, 100% 0%, 0% 0%)" }}
        ></div>

        {/* Centered Text */}
        <span className="text-white text-[24px] md:text-[28px] lg:text-[32px] font-bold font-['Hanken_Grotesk'] tracking-wide uppercase">
          {title}
        </span>
      </div>
    </div>
  );
};

export default SectionHeader;
