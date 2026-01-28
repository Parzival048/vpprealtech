import { useScrollReveal } from '../hooks/useScrollReveal';
import { StatCard } from '../components/ui/Card';
import './About.css';

const team = [
    {
        name: 'Vikram Patel',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    },
    {
        name: 'Priya Sharma',
        role: 'Head of Sales',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    },
    {
        name: 'Rajesh Kumar',
        role: 'Operations Director',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    },
];

// Professional SVG icons for values
const ValueIcons = {
    honesty: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="m8 12 4 4 8-8" />
        </svg>
    ),
    success: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    excellence: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    transparency: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
};

const values = [
    {
        iconKey: 'honesty',
        title: 'Honesty First',
        description: 'We tell it like it is. No hidden agendas, no pushy sales, just honest advice.',
    },
    {
        iconKey: 'success',
        title: 'Client Success',
        description: 'Your success is our success. We measure ourselves by your outcomes.',
    },
    {
        iconKey: 'excellence',
        title: 'Excellence',
        description: 'We strive for excellence in everything from customer service to execution.',
    },
    {
        iconKey: 'transparency',
        title: 'Trust & Transparency',
        description: 'Building lasting relationships through complete transparency.',
    },
];

const stats = [
    { value: '5+', label: 'Years Experience' },
    { value: '100+', label: 'Happy Clients' },
    { value: '₹100Cr+', label: 'Property Sold' },
    { value: '50+', label: 'Developer Partners' },
];

export default function About() {
    const [heroRef, heroVisible] = useScrollReveal();

    return (
        <main className="about-page">
            {/* Hero Section */}
            <section className="about-hero" ref={heroRef}>
                <div className="about-hero__bg"></div>
                <div className="container">
                    <div className={`about-hero__content ${heroVisible ? 'visible' : ''}`}>
                        <span className="about-hero__eyebrow">About Us</span>
                        <h1 className="about-hero__title">Built on Trust, Driven by Execution</h1>
                        <p className="about-hero__subtitle">
                            Clarity for Buyers. Results for Developers.
                        </p>
                        <div className="about-hero__description">
                            <p>
                                At VPP Realtech, we believe real estate transactions should be driven by clarity,
                                accountability, and results. Based in Pune, we operate as a real estate advisory
                                and mandate sales partner, supporting homebuyers with honest guidance and developers
                                with end-to-end sales execution.
                            </p>
                            <p>
                                We collaborate closely with select developers as a mandate or sole selling partner,
                                managing sales strategy, marketing coordination, and on-ground execution to ensure
                                project success. For buyers, we offer curated, RERA-compliant properties backed by
                                transparent advice and complete support.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values">
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">What We Stand For</span>
                        <h2 className="section-title">Our Values</h2>
                    </div>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <span className="value-card__icon">{ValueIcons[value.iconKey]}</span>
                                <h3 className="value-card__title">{value.title}</h3>
                                <p className="value-card__description">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section - Hidden as per requirements */}
            {/* <section className="about-team">
                <div className="container">
                    <div className="section-header">
                        <span className="section-eyebrow">Meet the Team</span>
                        <h2 className="section-title">Leadership</h2>
                        <p className="section-subtitle">
                            Our experienced team brings decades of combined real estate expertise.
                        </p>
                    </div>
                    <div className="team-grid">
                        {team.map((member, index) => (
                            <div key={index} className="team-card">
                                <div className="team-card__image">
                                    <img src={member.image} alt={member.name} />
                                </div>
                                <h3 className="team-card__name">{member.name}</h3>
                                <p className="team-card__role">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}
        </main>
    );
}
