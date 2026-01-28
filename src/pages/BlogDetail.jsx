import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { getBlogBySlug } from '../services/blogs';
import './BlogDetail.css';

// Process plain text content into HTML paragraphs
function formatContent(content) {
    if (!content) return '';

    // If content already has HTML tags, return as-is
    if (/<[a-z][\s\S]*>/i.test(content)) {
        return content;
    }

    // Convert plain text with line breaks to HTML paragraphs
    const paragraphs = content
        .split(/\n\n+/) // Split on double line breaks
        .map(para => para.trim())
        .filter(para => para.length > 0)
        .map(para => {
            // Handle single line breaks within a paragraph
            const formattedPara = para.replace(/\n/g, '<br />');

            // Check if it looks like a heading (starts with — or is short + ends with punctuation-free)
            if (para.startsWith('—') || para.startsWith('---') || para.startsWith('===')) {
                return `<h3>${formattedPara.replace(/^[—\-=]+\s*/, '')}</h3>`;
            }
            if (para.includes(':') && para.length < 100 && !para.includes('.')) {
                return `<h3>${formattedPara}</h3>`;
            }

            // Check for bullet points
            if (para.startsWith('•') || para.startsWith('-') || para.startsWith('*')) {
                const items = para.split(/\n/).map(item =>
                    `<li>${item.replace(/^[•\-*]\s*/, '')}</li>`
                ).join('');
                return `<ul>${items}</ul>`;
            }

            return `<p>${formattedPara}</p>`;
        })
        .join('\n');

    return paragraphs;
}

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

export default function BlogDetail() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBlog() {
            setLoading(true);
            const result = await getBlogBySlug(slug);
            if (result.success) {
                setBlog(result.data);
            }
            setLoading(false);
        }
        loadBlog();
    }, [slug]);

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

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = blog?.title || '';

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
        };

        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    };

    if (loading) {
        return (
            <main className="blog-detail-page">
                <div className="container">
                    <div className="blog-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading article...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!blog) {
        return (
            <main className="blog-detail-page">
                <div className="container">
                    <div className="blog-not-found">
                        <h1>Article Not Found</h1>
                        <p>The article you're looking for doesn't exist or has been removed.</p>
                        <Link to="/blogs">
                            <Button variant="primary">Browse All Articles</Button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Process content for display
    const formattedContent = formatContent(blog.content || blog.body || '');

    return (
        <main className="blog-detail-page">
            {/* Breadcrumb */}
            <div className="blog-breadcrumb">
                <div className="container">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/blogs">Blog</Link>
                    <span>/</span>
                    <span>{blog.title}</span>
                </div>
            </div>

            {/* Hero */}
            <section className="blog-hero">
                <div className="container">
                    <div className="blog-hero__content">
                        {blog.category && (
                            <span className="blog-hero__category">{getCategoryLabel(blog.category)}</span>
                        )}
                        <h1 className="blog-hero__title">{blog.title}</h1>
                        <div className="blog-hero__meta">
                            <span className="blog-hero__author">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                {blog.author || 'VPP Realtech'}
                            </span>
                            <span className="blog-hero__date">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {formatDate(blog.createdAt)}
                            </span>
                            <span className="blog-hero__read-time">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {blog.readingTime || 5} min read
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {blog.featuredImage && (
                <section className="blog-featured-image">
                    <div className="container">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                </section>
            )}

            {/* Image Gallery */}
            {blog.galleryImages && blog.galleryImages.length > 0 && (
                <section className="blog-gallery">
                    <div className="container">
                        <div className="blog-gallery__header">
                            <h3>Image Gallery</h3>
                            <span className="blog-gallery__count">{blog.galleryImages.length} images</span>
                        </div>
                        <div className="blog-gallery__grid">
                            {blog.galleryImages.map((image, index) => (
                                <div key={index} className="blog-gallery__item">
                                    <img
                                        src={image}
                                        alt={`Gallery image ${index + 1}`}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Content */}
            <section className="blog-content">
                <div className="container">
                    <div className="blog-content__grid">
                        <article className="blog-article">
                            <div
                                className="blog-article__body"
                                dangerouslySetInnerHTML={{ __html: formattedContent }}
                            />

                            {/* Source Link */}
                            {blog.sourceLink && (
                                <div className="blog-source">
                                    <a href={blog.sourceLink} target="_blank" rel="noopener noreferrer">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                        View Original Source
                                    </a>
                                </div>
                            )}
                        </article>

                        {/* Sidebar */}
                        <aside className="blog-sidebar">
                            {/* Share */}
                            <div className="blog-share">
                                <h4>Share this article</h4>
                                <div className="blog-share__buttons">
                                    <button onClick={() => handleShare('twitter')} title="Share on Twitter">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleShare('facebook')} title="Share on Facebook">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleShare('linkedin')} title="Share on LinkedIn">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleShare('whatsapp')} title="Share on WhatsApp">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Back to Blogs */}
                            <div className="blog-back">
                                <Link to="/blogs">
                                    <Button variant="outline" fullWidth>
                                        ← Back to All Articles
                                    </Button>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
