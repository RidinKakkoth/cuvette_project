"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import jwt from 'jsonwebtoken'; 

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const[userRole,setUserRole]=useState(null)
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(()=>{
    const token = localStorage.getItem('token'); 
        if(token){
          const decoded = jwt.decode(token); 
       
        const role=decoded.role
        
        
        setUserRole(role)
        
        }
        if(!token&&pathname!=='/signup'){

          router.push(`/signin`);
        }
        
        if (token && userRole && (pathname === "/signin" || pathname === "/signup")) {
          router.push(`/dashboard`);
        }
        
  },[pathname,router])


  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }


  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };
  const handleDashboard = () => {
   
    router.push(`/dashboard`);
    // router.push(`/dashboard?role=${userRole}`);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white font-bold text-lg " > <h1 className="cursor-pointer" onClick={handleDashboard}>Product App</h1></div>

      <div className="relative flex justify-center items-center gap-5" ref={dropdownRef}>
        <div className="flex justify-center items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <h1 className="text-white font-medium capitalize">{userRole}</h1>
        </div>
        <button
          onClick={toggleDropdown}
          className="bg-gray-700 text-white rounded-full p-2 focus:outline-none hover:bg-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 text-center top-14 w-48 bg-gray-200   rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-black font-semibold hover:bg-gray-100"
                >
                  Profile
                </a>
              </li>
              <hr className="h-[2px] bg-gray-400 w-3/4 mx-auto " />
              
              
              {userRole==="admin"&&<li>
                <a
                  href='/dashboard/add-product'
                  className="block px-4 py-2 text-sm text-black font-semibold hover:bg-gray-100"
                >
                  Add Product
                </a>
              </li>
              }
               {userRole==="admin"&&<hr className="h-[3px] bg-gray-400 w-3/4 mx-auto " />}
              
              {userRole==="admin"&&<li>
                <a
                  href="/pending-requests"
                  className="block px-4 py-2 text-sm text-black font-semibold hover:bg-gray-100"
                >
                  Pending Requests
                </a>
              </li>
              }
              {userRole==="team_member"&&<li>
                <a
                  href="/profile/my-submission"
                  className="block px-4 py-2 text-sm text-black font-semibold hover:bg-gray-100"
                >
                  My Submission
                </a>
              </li>
              }
              <hr className="h-[3px] bg-gray-400 w-3/4 mx-auto " />
              <li>
                <a
                  onClick={handleLogout}
                  className="block px-4 py-2 cursor-pointer text-sm text-black font-semibold hover:bg-gray-100"
                >
                  Logout
                </a>
              </li>
              
            </ul>
          </div>
        )}
      </div>
    
    </nav>
  );
}
