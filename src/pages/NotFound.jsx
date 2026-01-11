import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className="not-found">
            <div className="not-found__container">
                <div className="not-found__content">
                    {/* Animated 404 */}
                    <div className="not-found__number">
                        <span className="not-found__digit">4</span>
                        <span className="not-found__digit not-found__digit--home">🏠</span>
                        <span className="not-found__digit">4</span>
                    </div>

                    <h1 className="not-found__title">Page Not Found</h1>
                    <p className="not-found__message">
                        Sorry, we couldn't find the page you're looking for.
                        Perhaps you've ventured into uncharted territory?
                    </p>

                    {/* Action buttons */}
                    <div className="not-found__actions">
                        <Link to="/">
                            <Button variant="primary" size="lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                Go Home
                            </Button>
                        </Link>
                        <Link to="/projects">
                            <Button variant="outline" size="lg">
                                Browse Projects
                            </Button>
                        </Link>
                    </div>

                    {/* Quick links */}
                    <div className="not-found__links">
                        <h3>Popular Pages:</h3>
                        <nav className="not-found__nav">
                            <Link to="/projects">Projects</Link>
                            <Link to="/blogs">Blog</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                        </nav>
                    </div>
                </div>

                {/* Decorative background */}
                <div className="not-found__decoration">
                    <div className="not-found__shape not-found__shape--1"></div>
                    <div className="not-found__shape not-found__shape--2"></div>
                    <div className="not-found__shape not-found__shape--3"></div>
                </div>
            </div>
        </div>
    );
}
