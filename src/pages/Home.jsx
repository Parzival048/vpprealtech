import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button, { WhatsAppButton } from '../components/ui/Button';
import { ProjectCard, FeatureCard, StatCard } from '../components/ui/Card';
import { useScrollReveal, useStaggeredReveal } from '../hooks/useScrollReveal';
import { openWhatsApp } from '../utils/whatsapp';
import { getFeaturedProjects } from '../services/projects';
import logoImg from '../assets/vpppng.png';
import './Home.css';

const buyerBenefits = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M21 5c0 1.66-4 3-9 3s-9-1.34-9-3c0-1.66 4-3 9-3s9 1.34 9 3" />
            </svg>
        ),
        title: 'Verified Projects Only',
        description: 'Every property is thoroughly verified for RERA compliance, legal clearances, and developer credibility.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
        title: 'Save Your Time',
        description: 'We do the research, shortlisting, and paperwork. You just focus on choosing your dream home.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        ),
        title: 'Expert Guidance',
        description: 'Get honest advice on locations, pricing trends, and investment potential from industry experts.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
        title: 'Complete Support',
        description: 'From site visits to negotiation to documentation — we handle everything end-to-end.',
    },
];

const stats = [
    { value: '500+', label: 'Happy Families' },
    { value: '50+', label: 'Verified Projects' },
    { value: '10+', label: 'Years Experience' },
    { value: '₹200Cr+', label: 'Property Sold' },
];

export default function Home() {
    const audienceRef = useRef(null);
    const [heroRef, heroVisible] = useScrollReveal();
    const [statsRef, statsVisible] = useScrollReveal();
    const [benefitsContainerRef, visibleBenefits] = useStaggeredReveal(buyerBenefits.length, 150);
    const [projectsRef, projectsVisible] = useScrollReveal();
    const [featuredProjects, setFeaturedProjects] = useState([]);

    // Fetch featured projects from Firebase
    useEffect(() => {
        async function loadFeaturedProjects() {
            const result = await getFeaturedProjects();
            if (result.success && result.data.length > 0) {
                setFeaturedProjects(result.data.slice(0, 3));
            }
        }
        loadFeaturedProjects();
    }, []);

    const scrollToAudience = (type) => {
        audienceRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero__bg">
                    <div className="hero__bg-gradient"></div>
                    <div className="hero__bg-pattern"></div>
                    <div className="hero__bg-shapes">
                        <div className="hero__shape hero__shape--1"></div>
                        <div className="hero__shape hero__shape--2"></div>
                        <div className="hero__shape hero__shape--3"></div>
                    </div>
                </div>

                <div className="container hero__container" ref={heroRef}>
                    <div className={`hero__content ${heroVisible ? 'visible' : ''}`}>
                        <span className="hero__eyebrow">Trusted Real Estate Advisory in Pune</span>
                        <h1 className="hero__title">
                            Find Your Perfect Property with{' '}
                            <span className="hero__title-accent">Confidence</span>
                        </h1>
                        <p className="hero__subtitle">
                            Expert guidance for property buyers and exclusive mandate partnerships
                            for developers. Your trusted partner in Pune's real estate journey.
                        </p>
                        <div className="hero__actions">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => scrollToAudience('buyer')}
                            >
                                I'm Looking to Buy
                            </Button>
                            <WhatsAppButton
                                size="lg"
                                onClick={() => openWhatsApp({ type: 'buyer', source: 'hero' })}
                            >
                                Chat with Expert
                            </WhatsAppButton>
                        </div>
                        <div className="hero__trust">
                            <div className="hero__trust-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>RERA Verified Projects</span>
                            </div>
                            <div className="hero__trust-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Transparent Process</span>
                            </div>
                            <div className="hero__trust-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                </svg>
                                <span>500+ Happy Clients</span>
                            </div>
                        </div>
                    </div>

                    <div className={`hero__visual ${heroVisible ? 'visible' : ''}`}>
                        <div className="hero__image-container hero__logo-container">
                            <img
                                src={logoImg}
                                alt="VPP Realtech"
                                className="hero__logo-image"
                            />
                            <div className="hero__floating-card hero__floating-card--1">
                                <div className="hero__floating-icon">🏠</div>
                                <div>
                                    <strong>50+</strong>
                                    <span>Premium Projects</span>
                                </div>
                            </div>
                            <div className="hero__floating-card hero__floating-card--2">
                                <div className="hero__floating-icon">⭐</div>
                                <div>
                                    <strong>4.9/5</strong>
                                    <span>Client Rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Audience Split Section */}
            <section className="audience-split" ref={audienceRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">How Can We Help?</span>
                        <h2 className="section-title">Choose Your Journey</h2>
                        <p className="section-subtitle">
                            Whether you're buying your dream home or looking for a trusted sales partner,
                            we're here to help you succeed.
                        </p>
                    </div>

                    <div className="audience-split__grid">
                        <Link to="/buyers" className="audience-card audience-card--buyers">
                            <div className="audience-card__icon">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <path d="M24 12v24M12 24h24" stroke="currentColor" strokeWidth="2" />
                                    <path d="M32 20l-8-8-8 8M16 28l8 8 8-8" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="audience-card__title">I'm Buying a Property</h3>
                            <p className="audience-card__description">
                                Get expert guidance to find, evaluate, and secure your perfect property with complete transparency.
                            </p>
                            <ul className="audience-card__features">
                                <li>Verified RERA projects only</li>
                                <li>Honest price & location advice</li>
                                <li>Complete documentation support</li>
                            </ul>
                            <span className="audience-card__cta">
                                Explore Buyer Services
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>

                        <Link to="/developers" className="audience-card audience-card--developers">
                            <div className="audience-card__icon">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <rect x="8" y="16" width="12" height="24" rx="1" stroke="currentColor" strokeWidth="2" />
                                    <rect x="22" y="8" width="12" height="32" rx="1" stroke="currentColor" strokeWidth="2" />
                                    <rect x="36" y="20" width="8" height="20" rx="1" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="audience-card__title">I'm a Developer</h3>
                            <p className="audience-card__description">
                                Partner with us for exclusive mandate selling. We handle sales so you can focus on building.
                            </p>
                            <ul className="audience-card__features">
                                <li>Sole selling mandate partnerships</li>
                                <li>Transparent MIS & reporting</li>
                                <li>Dedicated sales execution</li>
                            </ul>
                            <span className="audience-card__cta">
                                Explore Developer Services
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" ref={statsRef}>
                <div className="container">
                    <div className={`stats-grid ${statsVisible ? 'visible' : ''}`}>
                        {stats.map((stat, index) => (
                            <StatCard key={index} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Buyer Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">Why Choose VPP Realtech</span>
                        <h2 className="section-title">Buy with Confidence</h2>
                        <p className="section-subtitle">
                            We're not just brokers — we're your trusted advisors committed to finding
                            you the right property at the right price.
                        </p>
                    </div>

                    <div className="benefits-grid" ref={benefitsContainerRef}>
                        {buyerBenefits.map((benefit, index) => (
                            <FeatureCard
                                key={index}
                                icon={benefit.icon}
                                title={benefit.title}
                                description={benefit.description}
                                delay={index * 150}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="projects-section" ref={projectsRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">Featured Properties</span>
                        <h2 className="section-title">Explore Our Projects</h2>
                        <p className="section-subtitle">
                            Handpicked, verified properties across Pune's prime locations.
                        </p>
                    </div>

                    <div className={`projects-grid ${projectsVisible ? 'visible' : ''}`}>
                        {featuredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>

                    <div className="projects-section__cta">
                        <Link to="/projects">
                            <Button variant="outline" size="lg">
                                View All Projects
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <div className="cta-box__content">
                            <h2 className="cta-box__title">Ready to Find Your Dream Property?</h2>
                            <p className="cta-box__description">
                                Let's discuss your requirements. Our experts are ready to help you find the perfect property.
                            </p>
                        </div>
                        <div className="cta-box__actions">
                            <Button
                                variant="white"
                                size="lg"
                                onClick={() => openWhatsApp({ type: 'buyer', source: 'cta-section' })}
                            >
                                Start a Conversation
                            </Button>
                            <Link to="/contact">
                                <Button variant="outline" size="lg" className="cta-box__outline-btn">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
