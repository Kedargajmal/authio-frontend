import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import { Link, useNavigate } from 'react-router-dom'
import assets from '../assets/assets.js'
import axios from 'axios'

const Login = () => {

    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);

        try {
            if (isCreatingAccount) {
                const res = await axios.post(`${backendURL}/register`, { name, email, password });
                if (res.status === 201) {
                    navigate("/");
                    toast.success("Account created successfully!");
                }
            } else {
                const res = await axios.post(`${backendURL}/login`, { email, password });
                if (res.status === 200) {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate("/");
                    toast.success("Logged in successfully!");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='position-relative min-vh-100 d-flex justify-content-center align-items-center overflow-hidden'
            style={{ backgroundColor: "#000", color: "#fff" }}>

            {/* --- MOVING BACKGROUND GLOWS --- */}
            <style>
                {`
                @keyframes pulse-out {
        0% { 
            transform: translate(-50%, -50%) scale(0.8); 
            opacity: 0.5; 
        }
        50% { 
            transform: translate(-50%, -50%) scale(1.2); 
            opacity: 0.8; 
        }
        100% { 
            transform: translate(-50%, -50%) scale(0.8); 
            opacity: 0.5; 
        }
    }
                `}
            </style>

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '30%',
                width: '700px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(100px)',
                zIndex: 0,
                pointerEvents: 'none',
                // Apply the new pulse animation
                animation: 'pulse-out 8s ease-in-out infinite' 
            }}></div>

            <div style={{
                position: 'absolute', bottom: '10%', right: '10%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(22, 163, 74, 0.40) 0%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
                animation: 'float-login-1 12s ease-in-out infinite reverse'
            }}></div>

            {/* --- LOGO SECTION --- */}
            <div style={{ position: "absolute", top: "20px", left: "30px" }}>
                <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
                    <img src={assets.mark} alt="logo" height={32} width={32} style={{ filter: 'brightness(0) invert(1)' }} />
                    <span className='fw-bold fs-4 text-white'>Authio</span>
                </Link>
            </div>

            {/* --- LOGIN CARD (GLASSMORPHISM) --- */}
            <div className='p-4 border border-secondary border-opacity-25'
                style={{
                    maxWidth: "400px",
                    width: "100%",
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(15px)",
                    zIndex: 1,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)'
                }}>

                <h2 className='text-center mb-2 fw-bold text-white'>
                    {isCreatingAccount ? "Create Account" : "Login"}
                </h2>
                <p className='text-center text-secondary mb-4 small'>
                    {isCreatingAccount ? "Join us today!" : "Welcome back, enter your details."}
                </p>

                <form onSubmit={onSubmitHandler}>
                    {isCreatingAccount && (
                        <div className='mb-3'>
                            <label className='form-label small text-secondary'>Username</label>
                            <input
                                type='text'
                                className='form-control bg-dark text-white border-secondary border-opacity-50'
                                style={{ backgroundColor: '#111 !important' }}
                                placeholder='Enter your username'
                                required
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>
                    )}

                    <div className='mb-3'>
                        <label className='form-label small text-secondary'>Email Address</label>
                        <input
                            type='email'
                            className='form-control bg-dark text-white border-secondary border-opacity-50'
                            placeholder='name@example.com'
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div className='mb-3'>
                        <label className='form-label small text-secondary'>Password</label>
                        <input
                            type='password'
                            className='form-control bg-dark text-white border-secondary border-opacity-50'
                            placeholder='••••••••'
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    {!isCreatingAccount && (
                        <div className='d-flex justify-content-end mb-4'>
                            <Link to="/reset-password" style={{ color: '#4ade80', fontSize: '13px' }} className='text-decoration-none'>Forgot Password?</Link>
                        </div>
                    )}

                    <button type='submit'
                        className='btn btn-light w-100 fw-bold rounded-pill py-2 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                        disabled={loading}>
                        {loading ? "Processing..." : isCreatingAccount ? "Sign Up" : "Login"}
                    </button>
                </form>

                <div className='mt-4 text-center'>
                    <p className='mb-0 small text-secondary'>
                        {isCreatingAccount ?
                            (
                                <>
                                    Already have an account?{" "}
                                    <span onClick={() => setIsCreatingAccount(false)}
                                        className='fw-bold' style={{ cursor: "pointer", color: '#4ade80' }}>
                                        Login
                                    </span>
                                </>
                            ) :
                            (
                                <>
                                    Don't have an account?{" "}
                                    <span onClick={() => setIsCreatingAccount(true)}
                                        className='fw-bold' style={{ cursor: "pointer", color: '#4ade80' }}>
                                        Sign Up
                                    </span>
                                </>)
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login