import React from "react";
import Nav from "../Nav Component/Nav";
import { Button } from "@mui/material";
import Footer from "../Nav Component/Footer";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center text-[#2b2c6c] justify-center px-4">
        <h1 className="text-xl font-bold text-center drop-shadow-lg">
          World-Class Medicine with a Personal Touch
        </h1>
        <div className="flex gap-4 mt-6">
          <Button
            variant="contained"
            color="secondary"
            className="!bg-pink-500 !text-white !px-6 !py-3 !text-lg"
          >
            Patient Stories
          </Button>
          <Button
            variant="contained"
            color="success"
            className="!bg-[#2FB297] !text-white !px-6 !py-3 !text-lg"
          >
            About Us
          </Button>
        </div>
      </div>

      {/* Footer Stays at Bottom */}
      <Footer />
    </div>
  );
}

export default Home;
