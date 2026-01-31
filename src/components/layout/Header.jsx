import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { openWhatsApp } from '../../utils/whatsapp';
import logoImg from '../../assets/vpplogo.png';
import './Header.css';

/**
 * Premium sticky header with navigation
 */
export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/buyers', label: 'For Buyers' },
        { path: '/developers', label: 'For Developers' },
        { path: '/projects', label: 'Projects' },
        { path: '/mandates', label: 'Mandates' },
        { path: '/blogs', label: 'Blog' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
                <div className="header__container container">
                    {/* Logo */}
                    <Link to="/" className="header__logo">
                        <img
                            src={logoImg}
                            alt="VPP Realtech"
                            className="header__logo-img"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="header__nav">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="header__actions">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openWhatsApp({ type: 'callback', source: 'header' })}
                            className="header__cta"
                        >
                            Get in Touch
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`header__menu-btn ${isMobileMenuOpen ? 'header__menu-btn--open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="header__menu-line"></span>
                        <span className="header__menu-line"></span>
                        <span className="header__menu-line"></span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`}>
                <div className="mobile-menu__overlay" onClick={() => setIsMobileMenuOpen(false)} />
                <nav className="mobile-menu__nav">
                    {navLinks.map((link, index) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
                            }
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => {
                            openWhatsApp({ type: 'callback', source: 'mobile-menu' });
                            setIsMobileMenuOpen(false);
                        }}
                        className="mobile-menu__cta"
                    >
                        Get in Touch
                    </Button>
                </nav>
            </div>
        </>
    );
}
