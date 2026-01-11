import { useState } from 'react';
import Button, { WhatsAppButton } from '../components/ui/Button';
import Input, { Textarea, Select } from '../components/ui/Input';
import { FeatureCard } from '../components/ui/Card';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { openWhatsApp } from '../utils/whatsapp';
import { createLead } from '../services/leads';
import './Buyers.css';

const journeySteps = [
    {
        step: '01',
        title: 'Share Your Requirements',
        description: 'Tell us your budget, preferred locations, and property type. We listen carefully to understand exactly what you need.',
    },
    {
        step: '02',
        title: 'Get Curated Options',
        description: 'We research and shortlist verified properties that match your criteria, saving you hours of searching.',
    },
    {
        step: '03',
        title: 'Visit & Evaluate',
        description: 'We arrange site visits and provide honest insights about each property, including pros and cons.',
    },
    {
        step: '04',
        title: 'Negotiate & Close',
        description: 'We negotiate the best deal on your behalf and handle all documentation until you get the keys.',
    },
];

const services = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
        title: 'Property Shortlisting',
        description: 'We filter through hundreds of options to present only verified, quality properties that match your needs.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Location Advisory',
        description: 'Get expert insights on neighborhood growth potential, infrastructure development, and investment value.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Price Advisory',
        description: 'We analyze market rates, historical trends, and comparable sales to ensure you pay the right price.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Site Visits',
        description: 'We coordinate and accompany you on property visits, highlighting important details you might miss.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
        title: 'Negotiation Support',
        description: 'We negotiate on your behalf to get the best possible price and terms from developers.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: 'Documentation & Closure',
        description: 'From agreement drafting to registration, we handle all paperwork to ensure a smooth transaction.',
    },
];

const budgetOptions = [
    { value: 'under-50l', label: 'Under ₹50 Lakhs' },
    { value: '50l-1cr', label: '₹50 Lakhs - ₹1 Crore' },
    { value: '1cr-2cr', label: '₹1 Crore - ₹2 Crore' },
    { value: '2cr-5cr', label: '₹2 Crore - ₹5 Crore' },
    { value: 'above-5cr', label: 'Above ₹5 Crore' },
];

const propertyTypeOptions = [
    { value: 'apartment', label: 'Apartment / Flat' },
    { value: 'villa', label: 'Villa / Row House' },
    { value: 'plot', label: 'Plot / Land' },
    { value: 'commercial', label: 'Commercial Space' },
];

export default function Buyers() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        budget: '',
        propertyType: '',
        location: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const [heroRef, heroVisible] = useScrollReveal();
    const [journeyRef, journeyVisible] = useScrollReveal();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        const result = await createLead({
            ...formData,
            type: 'buyer',
            preferredLocation: formData.location,
            source: 'buyers-page',
        });

        if (result.success) {
            setSubmitStatus({ type: 'success', message: result.message });
            setFormData({
                name: '',
                phone: '',
                email: '',
                budget: '',
                propertyType: '',
                location: '',
                message: '',
            });
        } else {
            setSubmitStatus({ type: 'error', message: result.error });
        }

        setIsSubmitting(false);
    };

    return (
        <main className="buyers-page">
            {/* Hero Section */}
            <section className="buyers-hero" ref={heroRef}>
                <div className="buyers-hero__bg"></div>
                <div className="container">
                    <div className={`buyers-hero__content ${heroVisible ? 'visible' : ''}`}>
                        <span className="buyers-hero__eyebrow">For Property Buyers</span>
                        <h1 className="buyers-hero__title">
                            Find Your Dream Home with{' '}
                            <span className="text-accent">Expert Guidance</span>
                        </h1>
                        <p className="buyers-hero__subtitle">
                            No hidden agendas. No pushy sales. Just honest advice to help you
                            make the right property decision.
                        </p>
                        <div className="buyers-hero__actions">
                            <WhatsAppButton
                                size="lg"
                                onClick={() => openWhatsApp({ type: 'buyer', source: 'buyers-hero' })}
                            >
                                Start Your Search
                            </WhatsAppButton>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promise Section */}
            <section className="promise-section">
                <div className="container">
                    <div className="promise-grid">
                        <div className="promise-card">
                            <div className="promise-card__icon">🎯</div>
                            <h3>Honest Advice</h3>
                            <p>We tell you the pros AND cons of every property. No sugar-coating.</p>
                        </div>
                        <div className="promise-card">
                            <div className="promise-card__icon">✅</div>
                            <h3>Verified Only</h3>
                            <p>Every project is RERA verified with complete legal due diligence.</p>
                        </div>
                        <div className="promise-card">
                            <div className="promise-card__icon">💰</div>
                            <h3>Best Price</h3>
                            <p>We negotiate hard to get you the best deal possible.</p>
                        </div>
                        <div className="promise-card">
                            <div className="promise-card__icon">🤝</div>
                            <h3>End-to-End Support</h3>
                            <p>From search to keys, we handle everything for you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="journey-section" ref={journeyRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">Your Buying Journey</span>
                        <h2 className="section-title">How We Help You Buy</h2>
                        <p className="section-subtitle">
                            A simple, transparent process designed to make your property purchase stress-free.
                        </p>
                    </div>

                    <div className={`journey-timeline ${journeyVisible ? 'visible' : ''}`}>
                        {journeySteps.map((step, index) => (
                            <div
                                key={index}
                                className="journey-step"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="journey-step__number">{step.step}</div>
                                <div className="journey-step__content">
                                    <h3 className="journey-step__title">{step.title}</h3>
                                    <p className="journey-step__description">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">What We Offer</span>
                        <h2 className="section-title">Our Buyer Services</h2>
                        <p className="section-subtitle">
                            Comprehensive support at every step of your property buying journey.
                        </p>
                    </div>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <FeatureCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                delay={index * 100}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Lead Form Section */}
            <section className="buyer-form-section">
                <div className="container">
                    <div className="buyer-form-container">
                        <div className="buyer-form-info">
                            <span className="section-eyebrow">Get Started</span>
                            <h2>Tell Us What You're Looking For</h2>
                            <p>
                                Share your requirements and our team will get back to you with
                                curated property options within 24 hours.
                            </p>
                            <ul className="buyer-form-benefits">
                                <li>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    Free property consultation
                                </li>
                                <li>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    No obligation or commitment
                                </li>
                                <li>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                    Expert recommendations
                                </li>
                            </ul>
                            <div className="buyer-form-whatsapp">
                                <p>Prefer WhatsApp?</p>
                                <WhatsAppButton
                                    onClick={() => openWhatsApp({ type: 'buyer', source: 'buyers-form' })}
                                >
                                    Chat with Us
                                </WhatsAppButton>
                            </div>
                        </div>

                        <form className="buyer-form" onSubmit={handleSubmit}>
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <div className="buyer-form__row">
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
                            </div>
                            <div className="buyer-form__row">
                                <Select
                                    label="Budget Range"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    options={budgetOptions}
                                    required
                                />
                                <Select
                                    label="Property Type"
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                    options={propertyTypeOptions}
                                    required
                                />
                            </div>
                            <Input
                                label="Preferred Location(s)"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Baner, Hinjewadi, Kharadi"
                            />
                            <Textarea
                                label="Additional Requirements"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us more about what you're looking for..."
                                rows={4}
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={isSubmitting}
                            >
                                Submit Your Requirements
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
