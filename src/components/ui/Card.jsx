import { Link } from 'react-router-dom';
import './Card.css';

/**
 * Project card component with hover effects
 */
export function ProjectCard({ project, variant = 'default' }) {
    const {
        id,
        slug,
        title,
        location,
        type,
        status,
        priceRange,
        image,
        images,
        developer,
    } = project;

    // Use first image from images array, or legacy image field, or placeholder
    const displayImage = (images && images.length > 0)
        ? images[0]
        : image || null;

    // Fallback for when image fails to load
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.parentElement.classList.add('project-card__image-wrapper--placeholder');
    };

    const statusLabels = {
        upcoming: 'Upcoming',
        ongoing: 'Ongoing',
        ready: 'Ready to Move',
    };

    const statusColors = {
        upcoming: 'info',
        ongoing: 'warning',
        ready: 'success',
    };

    // Inline styles to ensure visibility
    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e8e8ee',
        overflow: 'hidden',
        textDecoration: 'none',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        minHeight: '350px',
    };

    const imageWrapperStyle = {
        position: 'relative',
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(22, 33, 62, 0.1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '180px',
    };

    const contentStyle = {
        padding: '1.25rem',
        flex: 1,
        background: '#ffffff',
    };

    const footerStyle = {
        padding: '1rem 1.25rem',
        borderTop: '1px solid #e8e8ee',
        background: '#ffffff',
    };

    return (
        <Link to={`/projects/${slug || id}`} className={`project-card project-card--${variant}`} style={cardStyle}>
            <div style={imageWrapperStyle}>
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div style={{ color: '#FF6B35', opacity: 0.7 }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                )}
                {status && (
                    <span className={`project-card__badge badge badge-${statusColors[status] || 'primary'}`} style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                        {statusLabels[status] || status}
                    </span>
                )}
            </div>
            <div style={contentStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#8A8AA3' }}>
                    {type && <span style={{ textTransform: 'uppercase', fontWeight: 600, color: '#FF6B35', letterSpacing: '0.05em' }}>{type}</span>}
                    {location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {location}
                        </span>
                    )}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.5rem', lineHeight: 1.3 }}>{title}</h3>
                {priceRange && (
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#FF6B35', marginBottom: '0.25rem' }}>{priceRange}</p>
                )}
                {developer && (
                    <p style={{ fontSize: '0.875rem', color: '#8A8AA3' }}>By {developer}</p>
                )}
            </div>
            <div style={footerStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#FF6B35' }}>
                    Explore Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}

/**
 * Feature card component
 */
export function FeatureCard({ icon, title, description, delay = 0 }) {
    return (
        <div
            className="feature-card"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="feature-card__icon">
                {icon}
            </div>
            <h4 className="feature-card__title">{title}</h4>
            <p className="feature-card__description">{description}</p>
        </div>
    );
}

/**
 * Stat card component
 */
export function StatCard({ value, label, icon }) {
    return (
        <div className="stat-card">
            {icon && <div className="stat-card__icon">{icon}</div>}
            <div className="stat-card__value">{value}</div>
            <div className="stat-card__label">{label}</div>
        </div>
    );
}

/**
 * Testimonial card component
 */
export function TestimonialCard({ quote, author, role, image }) {
    return (
        <div className="testimonial-card">
            <div className="testimonial-card__quote">
                <svg className="testimonial-card__quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p>{quote}</p>
            </div>
            <div className="testimonial-card__author">
                {image && (
                    <img src={image} alt={author} className="testimonial-card__avatar" />
                )}
                <div>
                    <p className="testimonial-card__name">{author}</p>
                    <p className="testimonial-card__role">{role}</p>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
