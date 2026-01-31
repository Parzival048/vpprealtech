import { useState, useEffect } from 'react';
import logoImg from '../../assets/vpplogo.png';
import './Loader.css';

/**
 * Premium animated loader with VPP branding
 */
export default function Loader({ onLoadComplete }) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const duration = 2000;
        const interval = 20;
        const increment = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment + Math.random() * 2;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsComplete(true);
                        setTimeout(() => onLoadComplete?.(), 500);
                    }, 300);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onLoadComplete]);

    return (
        <div className={`loader ${isComplete ? 'loader--complete' : ''}`}>
            <div className="loader__content">
                {/* Logo Animation */}
                <div className="loader__logo">
                    <div className="loader__logo-icon">
                        <img
                            src={logoImg}
                            alt="VPP Realtech"
                            className="loader__logo-img"
                        />
                    </div>
                    <div className="loader__logo-glow"></div>
                </div>

                {/* Brand Name */}
                <div className="loader__brand">
                    <span className="loader__brand-text">VPP</span>
                    <span className="loader__brand-accent">Realtech</span>
                </div>

                {/* Progress Bar */}
                <div className="loader__progress">
                    <div
                        className="loader__progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                    <div className="loader__progress-glow" style={{ left: `${progress}%` }} />
                </div>

                {/* Loading Text */}
                <div className="loader__text">
                    <span className="loader__text-dots">
                        Loading Premium Experience
                        <span className="loader__dot">.</span>
                        <span className="loader__dot">.</span>
                        <span className="loader__dot">.</span>
                    </span>
                </div>
            </div>

            {/* Background Elements */}
            <div className="loader__bg">
                <div className="loader__bg-gradient"></div>
                <div className="loader__bg-pattern"></div>
                <div className="loader__particle loader__particle--1"></div>
                <div className="loader__particle loader__particle--2"></div>
                <div className="loader__particle loader__particle--3"></div>
                <div className="loader__particle loader__particle--4"></div>
            </div>
        </div>
    );
}
