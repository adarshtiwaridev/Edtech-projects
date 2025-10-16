import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FaUserCircle, FaSignOutAlt, FaCog, FaTachometerAlt } from "react-icons/fa";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.profile?.user);
  const token = useSelector((state) => state?.auth?.token);

  if (!user || !token) return null; // Hide dropdown if not logged in

  const handleLogout = () => {
    dispatch({ type: "auth/logout" }); // Adjust this based on your slice action
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <Dropdown placement="bottom-end" backdrop="blur">
      <DropdownTrigger>
        <div className="flex items-center space-x-2 cursor-pointer group">
          <Avatar
            src={user?.image || "/Images/defaultProfile.png"}
            alt={user?.firstName || "User"}
            size="md"
            className="border border-gray-300 group-hover:border-blue-500 transition"
          />
          <span className="hidden md:inline text-gray-700 font-medium group-hover:text-blue-600 transition">
            {user?.firstName || "User"}
          </span>
        </div>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="User profile options"
        variant="faded"
        className="bg-white rounded-xl shadow-lg p-2 min-w-[180px]"
      >
        <DropdownItem
          key="dashboard"
          startContent={<FaTachometerAlt className="text-blue-500" />}
          onClick={() => navigate("/dashboard")}
          className="hover:bg-blue-50 rounded-lg font-medium"
        >
          Dashboard
        </DropdownItem>

        <DropdownItem
          key="profile"
          startContent={<FaUserCircle className="text-blue-500" />}
          onClick={() => navigate("/profile")}
          className="hover:bg-blue-50 rounded-lg font-medium"
        >
          Profile
        </DropdownItem>

        <DropdownItem
          key="settings"
          startContent={<FaCog className="text-blue-500" />}
          onClick={() => navigate("/settings")}
          className="hover:bg-blue-50 rounded-lg font-medium"
        >
          Settings
        </DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          startContent={<FaSignOutAlt className="text-red-500" />}
          onClick={handleLogout}
          className="hover:bg-red-50 rounded-lg font-medium text-red-600"
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
