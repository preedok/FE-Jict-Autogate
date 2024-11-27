import React, { useState, useEffect } from "react";
import logout from "../../assets/logout.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
import { clearAuth } from "../../utils/token";
import Swal from "sweetalert2";
const DropdownLogout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const onLogout = () => {
    Swal.fire({
      title: "Please wait...",
      text: "Currently processing ",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    clearAuth();
    setTimeout(() => {
      Swal.close();
      clearAuth();
    }, 1000);
    setTimeout(() => {
      clearAuth();
      navigate("/");
    }, 1200);
  };
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center"
      >
        <img src={logout} alt="Logout Icon" width={40} height={40} />{" "}
        <svg
          className="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isOpen && (
        <p
          onClick={onLogout}
          href="#"
          className="absolute top-12 flex right-0 px-4 py-2 bg-white border-black rounded-lg shadow-2xl hover:cursor-pointer"
        >
          <LogoutIcon /> Logout
        </p>
      )}
    </div>
  );
};

export default DropdownLogout;
