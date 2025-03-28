import React, { useState } from "react";
import {
  Home,
  BarChart2,
  Package,
  Search,
  Menu,
  Bell,
  ChevronDown,
  Settings,
  Users,
  HelpCircle,
  LogOut,
  Shield,
  Code,
  Activity,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function UAdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      path: "/User-Dashboard",
    },
    {
      name: "Reg. Patients",
      icon: <Users size={20} />,
      path: "/User-Management",
    },
    {
      name: "Security",
      icon: <Shield size={20} />,
      path: "#gg2",
    },
    {
      name: "API",
      icon: <Code size={20} />,
      path: "#gg3",
    },
    {
      name: "Usage Status",
      icon: <Activity size={20} />,
      path: "#gg4",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "#gg5",
    },
  ];

  const currentPage = menuItems.find((item) => item.path === location.pathname);
  const activeItem = currentPage ? currentPage.name : "";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={`flex flex-col justify-between fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out bg-white border-r border-gray-100 shadow-sm ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Top Logo */}
        <div>
          <div className="flex items-center justify-center h-20 border-b border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-indigo-600 rounded-lg">
              U
            </div>
            {isSidebarOpen && (
              <span className="ml-3 text-xl font-bold text-gray-800">
                User Admin
              </span>
            )}
          </div>

          {/* Menu */}
          <nav
            className={`mt-5 px-4 ${
              isSidebarOpen ? "" : "flex flex-col items-center"
            }`}
          >
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex items-center w-full px-3 py-3 rounded-xl text-sm transition-all duration-200 group ${
                      location.pathname === item.path
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center ${
                        isSidebarOpen ? "" : "w-full"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer - Support Icon */}
        {/* Footer - Support Icon */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div
            className={`flex items-center w-full cursor-pointer rounded-xl hover:bg-gray-50 p-2 transition ${
              isSidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 text-pink-600 bg-pink-100 rounded-lg">
              <HelpCircle size={18} />
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Support</p>
                <p className="text-xs text-gray-500">Get help 24/7</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "pl-64" : "pl-20"
        }`}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center">
            <button
              className="p-2 mr-4 transition-all rounded-lg hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <div className="items-center hidden md:flex">
              <span className="font-medium text-gray-600">{activeItem}</span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-400">Overview</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative hidden md:block">
              <div className="flex items-center px-4 py-2 border border-gray-100 rounded-lg bg-gray-50">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 ml-2 text-sm bg-transparent border-none outline-none"
                />
                <div className="hidden ml-2 px-1.5 py-0.5 bg-gray-200 rounded text-xs text-gray-600 font-medium lg:flex items-center">
                  ⌘K
                </div>
              </div>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Settings size={20} className="text-gray-600" />
            </button>

            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="flex items-center justify-center w-8 h-8 font-medium text-white bg-indigo-600 rounded-lg">
                  A
                </div>
                <div className="items-center hidden ml-2 md:flex">
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
                  <ChevronDown
                    size={16}
                    className={`ml-1 text-gray-500 transition-transform duration-200 ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Users size={16} className="mr-3 text-gray-500" />
                    <span>Profile</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={16} className="mr-3 text-gray-500" />
                    <span>Settings</span>
                  </a>
                  <div className="h-px my-2 bg-gray-100"></div>
                  <a
                    href="/Home"
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} className="mr-3 text-red-500" />
                    <span>Logout</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div
          className="flex-1 p-6 overflow-y-auto"
          onClick={() => setIsProfileMenuOpen(false)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default UAdminLayout;
