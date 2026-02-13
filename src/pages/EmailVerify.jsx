import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets.js';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const EmailVerify = () => {
    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const { getUserData, isLoggedIn, userData, backendURL } = useContext(AppContext);
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "");
        e.target.value = value;
        if (value && index < 5) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, 6).split("");
        paste.forEach((digit, i) => {
            if (inputRef.current[i]) {
                inputRef.current[i].value = digit;
            }
        });
        const next = paste.length < 6 ? paste.length : 5;
        inputRef.current[next].focus();
    }

    const handleVerify = async () => {
        const otp = inputRef.current.map(input => input.value).join("");
        if (otp.length !== 6) {
            toast.error("Please enter all 6 digits");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(backendURL + "/verify-otp", { otp });
            if (res.status === 200) {
                toast.success("OTP Verified");
                getUserData();
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification Failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isLoggedIn && userData && userData.isAccountVerified) {
            navigate("/");
        }
    }, [isLoggedIn, userData, navigate]);

    return (
        <div className='d-flex align-items-center justify-content-center vh-100 position-relative overflow-hidden'
            style={{ backgroundColor: "#000", color: "#fff" }}>

            {/* --- PULSING OUTWARD GLOWS --- */}
            <style>
                {`
                @keyframes pulse-outward {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
                    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
                }
                `}
            </style>

            {/* Circle 1: Center */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '600px', height: '600px',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none',
                animation: 'pulse-outward 8s ease-in-out infinite'
            }}></div>

            {/* Circle 2: Top Right */}
            <div style={{
                position: 'absolute', top: '20%', left: '80%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(22, 163, 74, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
                animation: 'pulse-outward 10s ease-in-out infinite 2s'
            }}></div>

            {/* Circle 3: Bottom Left */}
            <div style={{
                position: 'absolute', bottom: '10%', left: '10%',
                width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(74, 222, 128, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(110px)', zIndex: 0, pointerEvents: 'none',
                animation: 'pulse-outward 12s ease-in-out infinite 4s'
            }}></div>

            {/* Navigation Logo */}
            <Link to="/" className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none">
                <img src={assets.mark} alt="logo" height={32} width={32} style={{ filter: 'brightness(0) invert(1)' }} />
                <span className='fs-4 fw-bold text-white'>Authio</span>
            </Link>

            {/* --- OTP CARD (GLASSMORPHISM) --- */}
            <div className='p-5 border border-secondary border-opacity-25'
                style={{
                    width: "100%",
                    maxWidth: '400px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: '16px',
                    zIndex: 1
                }}>
                <h2 className='text-center fw-bold mb-2'>Verify Account</h2>
                <p className="text-center text-secondary mb-4 small">
                    Enter the 6-digit code sent to your email
                </p>

                <div className="d-flex justify-content-between gap-2 mb-4">
                    {[...Array(6)].map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className='form-control text-center fs-4 bg-dark text-white border-secondary border-opacity-50'
                            style={{ width: '45px', height: '50px' }}
                            ref={(el) => (inputRef.current[i] = el)}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={handlePaste}
                        />
                    ))}
                </div>

                <button
                    className='btn btn-light w-100 fw-bold rounded-pill py-2 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    disabled={loading}
                    onClick={handleVerify}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </div>
        </div>
    )
}

export default EmailVerify