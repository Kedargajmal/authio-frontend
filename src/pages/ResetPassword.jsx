import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import assets from '../assets/assets.js';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';


const ResetPassword = () => {

    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    const { backendURL } = useContext(AppContext);

    axios.defaults.withCredentials = true;

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


    const onSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(backendURL + "/send-reset-otp?email=" + email)
            if (res.status === 200) {
                toast.success("OTP sent to your email");
                setIsEmailSent(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
        }
    }

    const handleVerify = () => {
        const otpValue = inputRef.current.map((input) => input.value).join("");
        if (otpValue.length !== 6) {
            toast.error("Please enter all digits");
            return;
        }
        setOtp(otpValue);
        setIsOtpSubmitted(true);
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(backendURL + "/reset-password", { email, otp, newPassword });
            if (res.status === 200) {
                toast.success("Password Reset Successfully");
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className='d-flex align-items-center justify-content-center vh-100 position-relative overflow-hidden'
            style={{ backgroundColor: "#000", color: "#fff" }}>

            {/* --- PULSING BACKGROUND GLOWS --- */}
            <style>
                {`
                @keyframes pulse-center {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
                    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
                }
                `}
            </style>

            <div style={{
                position: 'absolute', top: '50%', left: '40%',
                width: '600px', height: '600px',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.30) 0%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none',
                animation: 'pulse-center 8s ease-in-out infinite'
            }}></div>

            {/* Navigation Logo */}
            <Link to="/" className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none">
                <img src={assets.mark} alt="logo" height={32} width={32} style={{ filter: 'brightness(0) invert(1)' }} />
                <span className='fs-4 fw-bold text-white'>Authio</span>
            </Link>

            {/* --- RESET EMAIL FORM --- */}
            {!isEmailSent && (
                <div className="p-5 text-center border border-secondary border-opacity-25"
                    style={{ width: "100%", maxWidth: '400px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(15px)', borderRadius: '16px', zIndex: 1 }}>
                    <h2 className='mb-2 fw-bold'>Reset Password</h2>
                    <p className="mb-4 text-secondary small">Enter your registered Email</p>

                    <form onSubmit={onSubmitEmail}>
                        <div className="input-group mb-4 bg-dark bg-opacity-50 rounded-pill border border-secondary border-opacity-50 overflow-hidden">
                            <span className='input-group-text bg-transparent border-0 ps-4 text-secondary'>
                                <i className='bi bi-envelope'></i>
                            </span>
                            <input
                                type="email"
                                className="form-control bg-transparent border-0 text-white ps-1 pe-4"
                                placeholder="Email Address"
                                style={{ height: '50px' }}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <button className='btn btn-light w-100 py-2 rounded-pill fw-bold shadow-[0_0_15px_rgba(34,197,94,0.4)]' type='submit' disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                </div>
            )}

            {/* --- OTP VERIFICATION CARD --- */}
            {!isOtpSubmitted && isEmailSent && (
                <div className='p-5 rounded-4 border border-secondary border-opacity-25 text-center'
                    style={{ width: "400px", backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(15px)', zIndex: 1 }}>
                    <h2 className='fw-bold mb-2'>Verify OTP</h2>
                    <p className="text-secondary mb-4 small">Enter the 6-digit code sent to your email</p>

                    <div className="d-flex justify-content-between gap-2 mb-4">
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength={1}
                                className='form-control text-center fs-4 bg-dark text-white border-secondary border-opacity-50'
                                style={{ height: '50px', width: '45px' }}
                                ref={(el) => (inputRef.current[i] = el)}
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onPaste={handlePaste}
                            />
                        ))}
                    </div>
                    <button className='btn btn-light w-100 fw-bold rounded-pill py-2 shadow-[0_0_15px_rgba(34,197,94,0.4)]' disabled={loading} onClick={handleVerify} >
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </div>
            )}

            {/* --- NEW PASSWORD FORM --- */}
            {isOtpSubmitted && isEmailSent && (
                <div className="p-5 text-center border border-secondary border-opacity-25"
                    style={{ width: "100%", maxWidth: '400px', backgroundColor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(15px)', borderRadius: '16px', zIndex: 1 }}>
                    <h2 className='fw-bold mb-2'>New Password</h2>
                    <p className='mb-4 text-secondary small'>Set your new secure password</p>

                    <form onSubmit={onSubmitNewPassword}>
                        <div className='input-group mb-4 bg-dark bg-opacity-50 rounded-pill border border-secondary border-opacity-50 overflow-hidden'>
                            <span className='input-group-text bg-transparent border-0 ps-4 text-secondary'>
                                <i className='bi bi-lock-fill'></i>
                            </span>
                            <input
                                type="password"
                                className='form-control bg-transparent border-0 text-white ps-1 pe-4'
                                placeholder='New Password'
                                style={{ height: '50px' }}
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                                required
                            />
                        </div>
                        <button className='btn btn-light w-100 fw-bold rounded-pill py-2 shadow-[0_0_15px_rgba(34,197,94,0.4)]' type='submit' disabled={loading}>
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ResetPassword