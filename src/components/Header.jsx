import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import assets from '../assets/assets'

const Header = () => {
    const { userData } = useContext(AppContext);

    return (
        <div
            className='text-center d-flex flex-column align-items-center justify-content-center px-3 w-100'
            style={{
                minHeight: "100vh", // Changed to 100vh for full page height
                backgroundColor: '#000',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* --- ANIMATION KEYFRAMES --- */}
            <style>
                {`
                @keyframes float-1 {
                    0% { transform: translate(-50%, -50%) translate(-20%, -10%); }
                    50% { transform: translate(-50%, -50%) translate(20%, 15%); }
                    100% { transform: translate(-50%, -50%) translate(-20%, -10%); }
                }
                @keyframes float-2 {
                    0% { transform: translate(-50%, -50%) translate(15%, 20%); }
                    50% { transform: translate(-50%, -50%) translate(-15%, -10%); }
                    100% { transform: translate(-50%, -50%) translate(15%, 20%); }
                }
                @keyframes float-3 {
                    0% { transform: translate(-50%, -50%) translate(-10%, 25%); }
                    50% { transform: translate(-50%, -50%) translate(10%, -20%); }
                    100% { transform: translate(-50%, -50%) translate(-10%, 25%); }
                }
                `}
            </style>

            {/* --- 4 LAYERED GLOW CIRCLES --- */}

            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: '700px', height: '600px',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.50) 20%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none',
                animation: 'float-1 12s ease-in-out infinite'
            }}></div>

            <div style={{
                position: 'absolute', top: '30%', left: '70%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(22, 163, 74, 0.70) 10%, rgba(0, 0, 0, 0) 60%)',
                filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
                animation: 'float-2 15s ease-in-out infinite'
            }}></div>

            <div style={{
                position: 'absolute', top: '70%', left: '30%',
                width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(74, 222, 128, 0.38) 15%, rgba(0, 0, 0, 0) 65%)',
                filter: 'blur(110px)', zIndex: 0, pointerEvents: 'none',
                animation: 'float-3 10s ease-in-out infinite'
            }}></div>

            <div style={{
                position: 'absolute', top: '20%', left: '20%',
                width: '350px', height: '350px',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.37) 10%, rgba(0, 0, 0, 0) 70%)',
                filter: 'blur(90px)', zIndex: 0, pointerEvents: 'none',
                animation: 'float-1 18s ease-in-out infinite'
            }}></div>

            {/* Content Wrapper - Removed h-full to prevent top-clamping */}
            <div style={{ position: 'relative', zIndex: 1 }} className='d-flex flex-column align-items-center'>

                <img src={assets.header} alt="header" width={300} className='mb-1 drop-shadow-2xl contrast-130 brightness-90' />

                <h5 className='fw-semibold'>
                    Hey {userData ? userData.name : "Developer"} <span role='img' aria-label='wave'>✋</span>
                </h5>

                {/* Fixed Gradient Visibility */}
                <h1 className='fw-bold display-5 mb-3 bg-gradient-to-b from-green-300 to-green-700 bg-clip-text text-transparent'
                    style={{ WebkitBackgroundClip: 'text', filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.4))' }}>
                    Welcome to our Product
                </h1>

                <p className='mb-4' style={{ maxWidth: "500px", color: '#a1a1aa' }}>
                    Let's start with a quick product tour and you can setup the authentication in no time!
                </p>

                <button className='btn btn-light rounded-pill px-4 py-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:bg-black hover:text-white hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] active:scale-95'>
                    Get Started
                </button>
            </div>
        </div>
    )
}

export default Header