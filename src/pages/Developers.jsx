import { useState } from 'react';
import Button, { WhatsAppButton } from '../components/ui/Button';
import Input, { Textarea } from '../components/ui/Input';
import { FeatureCard, StatCard } from '../components/ui/Card';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { openWhatsApp } from '../utils/whatsapp';
import './Developers.css';

const engagementSteps = [
    {
        step: '01',
        title: 'Initial Consultation',
        description: 'We understand your project, target market, and sales expectations.',
    },
    {
        step: '02',
        title: 'Strategy Development',
        description: 'Our team creates a customized sales and marketing strategy for your project.',
    },
    {
        step: '03',
        title: 'Mandate Agreement',
        description: 'We formalize our partnership with clear terms, targets, and timelines.',
    },
    {
        step: '04',
        title: 'Sales Execution',
        description: 'Dedicated team handles lead generation, site visits, negotiations, and closures.',
    },
    {
        step: '05',
        title: 'Reporting & MIS',
        description: 'Regular reports on sales progress, leads, conversions, and market feedback.',
    },
];

const services = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Sole Selling Mandate',
        description: 'We take complete ownership of your project sales, ensuring focused execution and accountability.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        title: 'Dedicated Sales Team',
        description: 'A trained team exclusively focused on your project — managing leads, site visits, and closures.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
        ),
        title: 'Transparent Reporting',
        description: 'Detailed MIS reports, lead tracking, and conversion analytics delivered regularly.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        ),
        title: 'Marketing Support',
        description: 'Digital campaigns, collateral creation, and brand positioning assistance.',
    },
];

const stats = [
    { value: '50+', label: 'Projects Sold' },
    { value: '₹500Cr+', label: 'Sales Volume' },
    { value: '95%', label: 'Target Achievement' },
    { value: '15+', label: 'Developer Partners' },
];

export default function Developers() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        phone: '',
        email: '',
        projectName: '',
        projectLocation: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [heroRef, heroVisible] = useScrollReveal();
    const [stepsRef, stepsVisible] = useScrollReveal();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert('Thank you! Our team will contact you to schedule a strategy call.');
        setFormData({
            name: '',
            company: '',
            phone: '',
            email: '',
            projectName: '',
            projectLocation: '',
            message: '',
        });
        setIsSubmitting(false);
    };

    return (
        <main className="developers-page">
            {/* Hero Section */}
            <section className="developers-hero" ref={heroRef}>
                <div className="developers-hero__bg"></div>
                <div className="container">
                    <div className={`developers-hero__content ${heroVisible ? 'visible' : ''}`}>
                        <span className="developers-hero__eyebrow">For Real Estate Developers</span>
                        <h1 className="developers-hero__title">
                            Focus on Building.{' '}
                            <span className="text-accent">We'll Handle Sales.</span>
                        </h1>
                        <p className="developers-hero__subtitle">
                            Exclusive mandate partnerships with transparent execution, dedicated sales teams,
                            and accountability for results.
                        </p>
                        <div className="developers-hero__actions">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => openWhatsApp({ type: 'developer', source: 'developers-hero' })}
                            >
                                Schedule Strategy Call
                            </Button>
                            <WhatsAppButton
                                size="lg"
                                onClick={() => openWhatsApp({ type: 'developer', source: 'developers-hero' })}
                            >
                                Chat with Us
                            </WhatsAppButton>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="developers-stats">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <StatCard key={index} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="why-us-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">Why Partner With Us</span>
                        <h2 className="section-title">Your Sales, Our Responsibility</h2>
                        <p className="section-subtitle">
                            We don't just consult — we execute. Our mandate partnerships mean we're
                            accountable for your project's sales success.
                        </p>
                    </div>

                    <div className="why-us-grid">
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

            {/* Process Section */}
            <section className="process-section" ref={stepsRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">Our Process</span>
                        <h2 className="section-title">How We Work Together</h2>
                        <p className="section-subtitle">
                            A structured engagement process designed for transparency and results.
                        </p>
                    </div>

                    <div className={`process-timeline ${stepsVisible ? 'visible' : ''}`}>
                        {engagementSteps.map((step, index) => (
                            <div
                                key={index}
                                className="process-step"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="process-step__marker">
                                    <span className="process-step__number">{step.step}</span>
                                </div>
                                <div className="process-step__content">
                                    <h3 className="process-step__title">{step.title}</h3>
                                    <p className="process-step__description">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Differentiators Section */}
            <section className="differentiators-section">
                <div className="container">
                    <div className="differentiators-grid">
                        <div className="differentiator-card">
                            <div className="differentiator-card__icon">🎯</div>
                            <h3>Single Point Accountability</h3>
                            <p>One partner, one team, complete ownership of your sales targets.</p>
                        </div>
                        <div className="differentiator-card">
                            <div className="differentiator-card__icon">📊</div>
                            <h3>Data-Driven Decisions</h3>
                            <p>Real-time dashboards and analytics to track every aspect of sales.</p>
                        </div>
                        <div className="differentiator-card">
                            <div className="differentiator-card__icon">🤝</div>
                            <h3>Aligned Incentives</h3>
                            <p>Performance-based models that align our success with yours.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Form Section */}
            <section className="developer-form-section">
                <div className="container">
                    <div className="developer-form-container">
                        <div className="developer-form-info">
                            <span className="section-eyebrow">Get Started</span>
                            <h2>Let's Discuss Your Project</h2>
                            <p>
                                Share your project details and we'll schedule a no-obligation
                                strategy call to explore how we can help.
                            </p>
                            <div className="developer-form-features">
                                <div className="developer-form-feature">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                    <span>Free project assessment</span>
                                </div>
                                <div className="developer-form-feature">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                    <span>Customized sales strategy</span>
                                </div>
                                <div className="developer-form-feature">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                    <span>No commitment required</span>
                                </div>
                            </div>
                        </div>

                        <form className="developer-form" onSubmit={handleSubmit}>
                            <div className="developer-form__row">
                                <Input
                                    label="Your Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Company Name"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="developer-form__row">
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
                                    required
                                />
                            </div>
                            <div className="developer-form__row">
                                <Input
                                    label="Project Name"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Project Location"
                                    name="projectLocation"
                                    value={formData.projectLocation}
                                    onChange={handleChange}
                                />
                            </div>
                            <Textarea
                                label="Tell Us About Your Project"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Project type, inventory, current status, etc."
                                rows={4}
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={isSubmitting}
                            >
                                Request Strategy Call
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
