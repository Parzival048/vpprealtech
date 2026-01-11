import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button, { WhatsAppButton } from '../components/ui/Button';
import Input, { Textarea } from '../components/ui/Input';
import { openWhatsApp } from '../utils/whatsapp';
import { getProjectBySlug } from '../services/projects';
import { createLead } from '../services/leads';
import './ProjectDetail.css';

const statusLabels = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    ready: 'Ready to Move',
};

export default function ProjectDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch project from Firebase
    useEffect(() => {
        async function loadProject() {
            setLoading(true);
            const result = await getProjectBySlug(slug);
            if (result.success) {
                setProject(result.data);
            }
            setLoading(false);
        }
        loadProject();
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
                type: 'project',
                projectName: project.title,
                projectId: project.id,
                source: 'project-detail'
            });
            alert('Thank you! We will contact you about this project shortly.');
            setFormData({ name: '', phone: '', email: '', message: '' });
            setShowEnquiry(false);
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }

        setIsSubmitting(false);
    };

    // Extract YouTube video ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    // Loading state
    if (loading) {
        return (
            <main className="project-detail-page">
                <div className="container">
                    <div className="project-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading project details...</p>
                    </div>
                </div>
            </main>
        );
    }

    // Not found state
    if (!project) {
        return (
            <main className="project-detail-page">
                <div className="container">
                    <div className="project-not-found">
                        <h1>Project Not Found</h1>
                        <p>The project you're looking for doesn't exist or has been removed.</p>
                        <Link to="/projects">
                            <Button variant="primary">Browse All Projects</Button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Get images array (from new format or legacy)
    const projectImages = project.images && project.images.length > 0
        ? project.images
        : project.image
            ? [project.image]
            : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'];

    const videoId = getYouTubeId(project.videoUrl);

    return (
        <main className="project-detail-page">
            {/* Breadcrumb */}
            <div className="project-breadcrumb">
                <div className="container">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/projects">Projects</Link>
                    <span>/</span>
                    <span>{project.title}</span>
                </div>
            </div>

            {/* Gallery Section */}
            <section className="project-gallery">
                <div className="container">
                    <div className="project-gallery__grid">
                        <div className="project-gallery__main">
                            <img
                                src={projectImages[activeImage]}
                                alt={project.title}
                                className="project-gallery__main-image"
                            />
                            {project.status && (
                                <span className={`project-gallery__badge badge badge-${project.status === 'ready' ? 'success' : project.status === 'ongoing' ? 'warning' : 'info'}`}>
                                    {statusLabels[project.status]}
                                </span>
                            )}
                        </div>
                        {projectImages.length > 1 && (
                            <div className="project-gallery__thumbs">
                                {projectImages.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`project-gallery__thumb ${activeImage === index ? 'active' : ''}`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <img src={img} alt={`${project.title} ${index + 1}`} />
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
                                title={`${project.title} Video`}
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
                                    {project.type && <span className="project-type">{project.type}</span>}
                                    <h1 className="project-title">{project.title}</h1>
                                    {project.location && (
                                        <p className="project-location">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            {project.location}
                                        </p>
                                    )}
                                </div>
                                {project.priceRange && (
                                    <div className="project-price">
                                        <span className="project-price__label">Price Range</span>
                                        <span className="project-price__value">{project.priceRange}</span>
                                    </div>
                                )}
                            </div>

                            {/* Quick Info */}
                            <div className="project-quick-info">
                                {project.developer && (
                                    <div className="project-quick-info__item">
                                        <span className="label">Developer</span>
                                        <span className="value">{project.developer}</span>
                                    </div>
                                )}
                                {project.reraId && (
                                    <div className="project-quick-info__item">
                                        <span className="label">RERA ID</span>
                                        <span className="value">{project.reraId}</span>
                                    </div>
                                )}
                                {project.possession && (
                                    <div className="project-quick-info__item">
                                        <span className="label">Possession</span>
                                        <span className="value">{project.possession}</span>
                                    </div>
                                )}
                                {project.sizes && (
                                    <div className="project-quick-info__item">
                                        <span className="label">Sizes</span>
                                        <span className="value">{project.sizes}</span>
                                    </div>
                                )}
                            </div>

                            {/* Overview */}
                            {project.overview && (
                                <div className="project-section">
                                    <h2>Overview</h2>
                                    <p>{project.overview}</p>
                                </div>
                            )}

                            {/* Configurations */}
                            {project.configurations && project.configurations.length > 0 && (
                                <div className="project-section">
                                    <h2>Configurations</h2>
                                    <div className="project-configs">
                                        {project.configurations.map((config, index) => (
                                            <span key={index} className="project-config-tag">{config}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Highlights */}
                            {project.highlights && project.highlights.length > 0 && (
                                <div className="project-section">
                                    <h2>Key Highlights</h2>
                                    <ul className="project-highlights">
                                        {project.highlights.map((highlight, index) => (
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
                            {project.amenities && project.amenities.length > 0 && (
                                <div className="project-section">
                                    <h2>Amenities</h2>
                                    <div className="project-amenities">
                                        {project.amenities.map((amenity, index) => (
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
                            {project.address && (
                                <div className="project-section">
                                    <h2>Location</h2>
                                    <p className="project-address">{project.address}</p>
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
                                            type: 'project',
                                            projectName: project.title,
                                            source: 'project-detail'
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
                        <h3>Enquire About {project.title}</h3>
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
