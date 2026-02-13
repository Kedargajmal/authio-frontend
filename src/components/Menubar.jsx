import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Menubar = () => {

  const navigate = useNavigate();
  const {userData, backendURL, setIsLoggedIn, setUserData} = useContext(AppContext);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) =>{
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside );
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials =  true
      const res = await axios.post(backendURL + "/logout");
      if (res.status === 200) 
      {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  const SendVerificationOtp = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.post(backendURL + "/send-otp");
        
        if (res.status === 200) {
          navigate("/email-verify");
          toast.success("OTP has been sent successfully");
        }
        else{
          toast.error("Unable to Send OTP");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
  }

  return (
    // Set to absolute or fixed and transparent so glows show behind it
    <div style={{ position: 'absolute', width: '100%', top: 0, left: 0, zIndex: 50,  }}> 
      <nav className='navbar px-5 py-4 d-flex justify-between align-items-center' 
           style={{ 
             backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle transparency
             backdropFilter: 'blur(10px)',         // Blurs the background glows slightly
             borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
           }}> 
        
        <div className='d-flex align-items-center gap-2'>
          <img src={assets.mark} alt='Logo' className='w-8 h-8' style={{ filter: 'brightness(0) invert(1)' }}/>
          
          <span className='font-bold text-xl text-white'>
            Authio
          </span>
        </div>

        {userData ? (
            <div className='position-relative' ref={dropdownRef}>
              <div className="bg-white text-dark rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  userSelect: "none"
                }}
                onClick={() => setDropDownOpen((prev) => !prev)}
                >
                  {userData.name[0].toUpperCase()}
              </div>
                
                {dropDownOpen && (
                  <div className="position-absolute shadow rounded p-2"
                    style={{
                      top: "50px",
                      right: 0,
                      zIndex: 100,
                      backgroundColor: 'rgba(17, 17, 17, 0.9)', // Semi-transparent dropdown
                      backdropFilter: 'blur(5px)',
                      border: '1px solid #333'
                    }}> 
                        {!userData.isAccountVerified && (
                          <div className="dropdown-item py-1 px-2 text-white" style={{cursor: "pointer"}} onClick={SendVerificationOtp}>
                              Verify Email
                          </div>
                        )}
                        <div className="dropdown-item py-1 px-2 text-danger" style={{cursor: "pointer"}} onClick={handleLogout}>
                          Logout
                        </div>
                  </div>
                )}
            </div>
        ): (
          <div className="btn btn-light rounded-pill px-3 shadow-[0_0_15px_rgba(34,197,94,0.5)]" onClick={() => navigate("/login")}>
            Login <i className='bi bi-arrow-right ms-2'></i>
        </div>
        )}
      </nav>
    </div>
  )
}

export default Menubar