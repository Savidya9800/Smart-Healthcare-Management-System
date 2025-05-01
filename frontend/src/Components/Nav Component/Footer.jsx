import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Footer() {
  return (
    <div className="w-full h-[226px] bg-[#2b2c6c] flex flex-col justify-between relative">
      
      {/* Social Icons */}
      <div className="absolute top-[46px] left-1/2 transform -translate-x-1/2 flex space-x-6 text-white text-3xl">
        <i className="text-5xl fa-brands fa-facebook"></i>
        <i className="text-5xl fa-brands fa-whatsapp"></i>
        <i className="text-5xl fa-brands fa-twitter"></i>
        <i className="text-5xl fa-brands fa-instagram"></i>
      </div>

      {/* Navigation Links */}
      <div className="w-full flex justify-center items-center absolute top-[130px] space-x-6">
        <Link to="/About-Us" className="text-xl font-normal text-white">About Us</Link>
        <Link to="/Contact-Us" className="text-xl font-normal text-white">Contact Us</Link>
        <Link to="/Privacy-Policy" className="text-xl font-normal text-white">Privacy Policy</Link>
        <Link to="/FAQ" className="text-xl font-normal text-white">FAQ</Link>
        <Link to="/Blog" className="text-xl font-normal text-white">Blog</Link>
        <Link to="/Help" className="text-xl font-normal text-white">Help & Artist</Link>
      </div>

      {/* Footer Bottom Bar */}
      <div className="w-full absolute bottom-0 bg-white h-[49px] flex flex-col items-center justify-center">
        <span className="text-black text-[13px] font-normal">
          © All Rights Reserved to the MEDI FLOW | Privacy Policy | Cookie Policy | Developed by ITPM_Y3S1_WE_91 Group
        </span>
        <span className="text-black text-[13px] font-bold">Protected By Copyscape</span>
      </div>

      {/* Footer Side Image */}
      <img
        className="w-[350px] h-[350px] absolute bottom-[-35px] left-[-50px]"
        src="/Logo2.png"
        alt="Footer Side Image"
      />
    </div>
  );
}

export default Footer;
