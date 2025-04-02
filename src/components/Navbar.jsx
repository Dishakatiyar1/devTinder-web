import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar bg-white shadow sticky top-0 z-50 px-4 py-2">
      <div className="flex-1">
        <a className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors cursor-pointer">
          devTinder
        </a>
      </div>
      {Object.keys(user)?.length > 0 && (
        <div className="flex gap-4 items-center">
          <p>Welcome, {user?.firstName} </p>
          <div
            className="relative group"
            // onMouseEnter={() => setIsDropdownOpen(true)}
            // onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={toggleDropdown}
            >
              <div className="w-10 rounded-full overflow-hidden">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="User avatar"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            {isDropdownOpen && (
              <ul
                tabIndex={0}
                className="dropdown-content absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <li className="p-2 hover:bg-gray-100 rounded-md transition">
                  <Link
                    to="/profile"
                    className="flex justify-between items-center"
                  >
                    Profile
                    <span className="badge bg-blue-500 text-white">New</span>
                  </Link>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded-md transition">
                  <a>Settings</a>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded-md transition">
                  <a>Logout</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
