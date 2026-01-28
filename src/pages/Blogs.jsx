import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getBlogs } from '../services/blogs';
import './Blogs.css';

// Category display name mapping
const categoryLabels = {
    'buyer-insights': 'Buyer Insights',
    'micro-market-deep-dives': 'Micro-Market Deep Dives',
    'market-intelligence': 'Market Intelligence',
    'data-snapshots': 'Data Snapshots',
    'buyer-mistakes': 'Buyer Mistakes',
    'developer-playbook': 'Developer Playbook',
    'opinion': 'Opinion',
    'market-trends': 'Market Trends',
    'buying-tips': 'Buying Tips',
    'investment': 'Investment',
    'legal': 'Legal & Documentation',
    'news': 'News & Updates',
};

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [headerRef, headerVisible] = useScrollReveal();

    useEffect(() => {
        async function loadBlogs() {
            const result = await getBlogs();
            if (result.success) {
                setBlogs(result.data);
            }
            setLoading(false);
        }
        loadBlogs();
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryLabel = (value) => {
        return categoryLabels[value] || value || '';
    };

    // Handle image error - replace with placeholder
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = PLACEHOLDER_IMAGE;
    };

    return (
        <main className="blogs-page">
            {/* Header */}
            <section className="blogs-header" ref={headerRef}>
                <div className="blogs-header__bg"></div>
                <div className="container">
                    <div className={`blogs-header__content ${headerVisible ? 'visible' : ''}`}>
                        <span className="blogs-header__eyebrow">Insights & Updates</span>
                        <h1 className="blogs-header__title">Our Blog</h1>
                        <p className="blogs-header__subtitle">
                            Stay updated with the latest real estate trends, market insights, and property buying tips.
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="blogs-listing">
                <div className="container">
                    {loading ? (
                        <div className="blogs-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading blogs...</p>
                        </div>
                    ) : blogs.length > 0 ? (
                        <div className="blogs-grid">
                            {blogs.map((blog, index) => (
                                <article
                                    key={blog.id}
                                    className={`blog-card ${index === 0 ? 'blog-card--featured' : ''}`}
                                >
                                    <Link to={`/blogs/${blog.slug}`} className="blog-card__link">
                                        <div className="blog-card__image">
                                            <img
                                                src={blog.featuredImage || PLACEHOLDER_IMAGE}
                                                alt={blog.title}
                                                loading="lazy"
                                                onError={handleImageError}
                                            />
                                            {blog.category && (
                                                <span className="blog-card__category">{getCategoryLabel(blog.category)}</span>
                                            )}
                                        </div>
                                        <div className="blog-card__content">
                                            <div className="blog-card__meta">
                                                <span className="blog-card__date">{formatDate(blog.createdAt)}</span>
                                                <span className="blog-card__divider">•</span>
                                                <span className="blog-card__read-time">{blog.readingTime || 5} min read</span>
                                            </div>
                                            <h2 className="blog-card__title">{blog.title}</h2>
                                            {blog.excerpt && (
                                                <p className="blog-card__excerpt">{blog.excerpt}</p>
                                            )}
                                            <span className="blog-card__cta">
                                                Read More
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="blogs-empty">
                            <div className="blogs-empty__icon">📝</div>
                            <h3>No Blog Posts Yet</h3>
                            <p>Check back soon for insightful articles about real estate and property buying.</p>
                            <Link to="/" className="btn btn-primary">
                                Back to Home
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
