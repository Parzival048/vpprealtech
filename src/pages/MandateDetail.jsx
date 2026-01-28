import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button, { WhatsAppButton } from '../components/ui/Button';
import Input, { Textarea } from '../components/ui/Input';
import { openWhatsApp } from '../utils/whatsapp';
import { getMandateBySlug } from '../services/mandates';
import { createLead } from '../services/leads';
import './ProjectDetail.css';

const statusLabels = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    ready: 'Ready to Move',
};

const partnershipLabels = {
    'sole-selling': 'Sole Selling Partner',
    'mandate': 'Mandate Partner',
    'co-selling': 'Co-Selling Partner',
};

export default function MandateDetail() {
    const { slug } = useParams();
    const [mandate, setMandate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadMandate() {
            setLoading(true);
            const result = await getMandateBySlug(slug);
            if (result.success) {
                setMandate(result.data);
            }
            setLoading(false);
        }
        loadMandate();
    }, [slug]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createLead({
                ...formData,
                type: 'mandate',
                projectName: mandate.title,
                projectId: mandate.id,
                source: 'mandate-detail'
            });
            alert('Thank you! We will contact you about this property shortly.');
            setFormData({ name: '', phone: '', email: '', message: '' });
            setShowEnquiry(false);
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }

        setIsSubmitting(false);
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    if (loading) {
        return (
            <main className="project-detail-page">
                <div className="container">
                    <div className="project-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading mandate details...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!mandate) {
        return (
            <main className="project-detail-page">
                <div className="container">
                    <div className="project-not-found">
                        <h1>Mandate Not Found</h1>
                        <p>The mandate you're looking for doesn't exist or has been removed.</p>
                        <Link to="/mandates">
                            <Button variant="primary">Browse All Mandates</Button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const mandateImages = mandate.images && mandate.images.length > 0
        ? mandate.images
        : mandate.image
            ? [mandate.image]
            : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'];

    const videoId = getYouTubeId(mandate.videoUrl);

    return (
        <main className="project-detail-page">
            {/* Breadcrumb */}
            <div className="project-breadcrumb">
                <div className="container">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/mandates">Mandates</Link>
                    <span>/</span>
                    <span>{mandate.title}</span>
                </div>
            </div>

            {/* Gallery Section */}
            <section className="project-gallery">
                <div className="container">
                    <div className="project-gallery__grid">
                        <div className="project-gallery__main">
                            <img
                                src={mandateImages[activeImage]}
                                alt={mandate.title}
                                className="project-gallery__main-image"
                            />
                            {mandate.status && (
                                <span className={`project-gallery__badge badge badge-${mandate.status === 'ready' ? 'success' : mandate.status === 'ongoing' ? 'warning' : 'info'}`}>
                                    {statusLabels[mandate.status]}
                                </span>
                            )}
                            {mandate.partnershipType && (
                                <span className="project-gallery__badge badge badge-partner" style={{ top: '56px', background: '#8B5CF6' }}>
                                    {partnershipLabels[mandate.partnershipType]}
                                </span>
                            )}
                        </div>
                        {mandateImages.length > 1 && (
                            <div className="project-gallery__thumbs">
                                {mandateImages.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`project-gallery__thumb ${activeImage === index ? 'active' : ''}`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <img src={img} alt={`${mandate.title} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Video Section */}
            {videoId && (
                <section className="project-video">
                    <div className="container">
                        <h2>Project Video</h2>
                        <div className="project-video__wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={`${mandate.title} Video`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Content Section */}
            <section className="project-content">
                <div className="container">
                    <div className="project-content__grid">
                        {/* Main Content */}
                        <div className="project-content__main">
                            <div className="project-header">
                                <div>
                                    {mandate.type && <span className="project-type">{mandate.type}</span>}
                                    <h1 className="project-title">{mandate.title}</h1>
                                    {mandate.developer && (
                                        <p className="project-developer" style={{ color: '#8B5CF6', fontWeight: '600', margin: '0.5rem 0' }}>
                                            by {mandate.developer}
                                        </p>
                                    )}
                                    {mandate.location && (
                                        <p className="project-location">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            {mandate.location}
                                        </p>
                                    )}
                                </div>
                                {mandate.priceRange && (
                                    <div className="project-price">
                                        <span className="project-price__label">Price Range</span>
                                        <span className="project-price__value">{mandate.priceRange}</span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Info */}
                            <div className="project-quick-info">
                                {mandate.developer && (
                                    <div className="project-quick-info__item">
                                        <span className="label">Developer</span>
                                        <span className="value">{mandate.developer}</span>
                                    </div>
                                )}
                                {mandate.reraId && (
                                    <div className="project-quick-info__item">
                                        <span className="label">RERA ID</span>
                                        <span className="value">{mandate.reraId}</span>
                                    </div>
                                )}
                                {mandate.possession && (
                                    <div className="project-quick-info__item">
                                        <span className="label">Possession</span>
                                        <span className="value">{mandate.possession}</span>
                                    </div>
                                )}
                                {mandate.partnershipType && (
                                    <div className="project-quick-info__item">
                                        <span className="label">Partnership</span>
                                        <span className="value">{partnershipLabels[mandate.partnershipType]}</span>
                                    </div>
                                )}
                            </div>

                            {/* Overview */}
                            {mandate.overview && (
                                <div className="project-section">
                                    <h2>Overview</h2>
                                    <p>{mandate.overview}</p>
                                </div>
                            )}

                            {/* Configurations */}
                            {mandate.configurations && mandate.configurations.length > 0 && (
                                <div className="project-section">
                                    <h2>Configurations</h2>
                                    <div className="project-configs">
                                        {mandate.configurations.map((config, index) => (
                                            <span key={index} className="project-config-tag">{config}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Highlights */}
                            {mandate.highlights && mandate.highlights.length > 0 && (
                                <div className="project-section">
                                    <h2>Key Highlights</h2>
                                    <ul className="project-highlights">
                                        {mandate.highlights.map((highlight, index) => (
                                            <li key={index}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 12l2 2 4-4" />
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Amenities */}
                            {mandate.amenities && mandate.amenities.length > 0 && (
                                <div className="project-section">
                                    <h2>Amenities</h2>
                                    <div className="project-amenities">
                                        {mandate.amenities.map((amenity, index) => (
                                            <span key={index} className="project-amenity">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12l5 5L20 7" />
                                                </svg>
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {mandate.address && (
                                <div className="project-section">
                                    <h2>Location</h2>
                                    <p className="project-address">{mandate.address}</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="project-content__sidebar">
                            <div className="project-enquiry-card">
                                <h3>Interested in this property?</h3>
                                <p>Get in touch for site visit and more details.</p>
                                <div className="project-enquiry-actions">
                                    <WhatsAppButton
                                        fullWidth
                                        onClick={() => openWhatsApp({
                                            type: 'mandate',
                                            projectName: mandate.title,
                                            source: 'mandate-detail'
                                        })}
                                    >
                                        Chat on WhatsApp
                                    </WhatsAppButton>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={() => setShowEnquiry(true)}
                                    >
                                        Request Callback
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enquiry Modal */}
            {showEnquiry && (
                <div className="enquiry-modal">
                    <div className="enquiry-modal__overlay" onClick={() => setShowEnquiry(false)} />
                    <div className="enquiry-modal__content">
                        <button className="enquiry-modal__close" onClick={() => setShowEnquiry(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                        <h3>Enquire About {mandate.title}</h3>
                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Your Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Textarea
                                label="Message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us about your requirements..."
                                rows={3}
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                loading={isSubmitting}
                            >
                                Submit Enquiry
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
