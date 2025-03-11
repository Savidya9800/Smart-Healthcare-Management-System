import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Footer() {
  return (
    <div className="w-full h-[226px] relative bg-[#2b2c6c] mt-50">
      <div className="w-full h-[49px] absolute bottom-0 bg-white" />

      <div className="w-full flex justify-center items-center absolute top-[130px] space-x-6">
        <Link
          to="/About-Us"
          className="text-white text-xl font-normal font-['Hanken_Grotesk']"
        >
          About Us
        </Link>
        <Link
          to="/Contact-Us"
          className="text-white text-xl font-normal font-['Hanken_Grotesk']"
        >
          Contact Us
        </Link>
        <Link
          to="/Privacy-Policy"
          className="text-white text-xl font-normal font-['Hanken_Grotesk']"
        >
          Privacy Policy
        </Link>
        <Link
          to="/FAQ"
          className="text-white text-xl font-normal font-['Hanken_Grotesk']"
        >
          FAQ
        </Link>
        <Link
          to="/Blog"
          className="text-white text-xl font-normal font-['Hanken_Grotesk']"
        >
          Blog
        </Link>
        <Link
          to="/Help"
          className="text-white text-xl font-normal font-['Hanken_Grotesk']"
        >
          Help & Artist
        </Link>
      </div>

      <div className="w-full text-center absolute bottom-[5px]">
        <span className="text-black text-[13px] font-normal font-['Inter'] block">
          © All Rights Reserved to the MEDI FLOW | Privacy Policy | Cookie
          Policy | Developed by ITPM_Y3S1_WE_91 Group
        </span>
        <span className="text-black text-[13px] font-bold font-['Inter']">
          Protected By Copyscape
        </span>
      </div>

      <div className="w-[350px] h-[100px] absolute top-[46px] left-1/2 transform -translate-x-1/2 flex space-x-6 text-white text-3xl justify-center ">
        <i className="fa-brands fa-facebook text-5xl"></i>
        <i className="fa-brands fa-whatsapp text-5xl"></i>
        <i className="fa-brands fa-twitter text-5xl"></i>
        <i className="fa-brands fa-instagram text-5xl"></i>
      </div>

      <img
        className="w-[350px] h-[350px] absolute bottom-[-35px] left-[-50px]"
        src="/Logo2.png"
        alt="Footer Side Image"
      />
      
    </div>
  );
}

export default Footer;
