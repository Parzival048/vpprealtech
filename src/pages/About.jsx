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

const values = [
    {
        icon: '🎯',
        title: 'Honesty First',
        description: 'We tell it like it is. No hidden agendas, no pushy sales, just honest advice.',
    },
    {
        icon: '🤝',
        title: 'Client Success',
        description: 'Your success is our success. We measure ourselves by your outcomes.',
    },
    {
        icon: '⚡',
        title: 'Excellence',
        description: 'We strive for excellence in everything from customer service to execution.',
    },
    {
        icon: '🔒',
        title: 'Trust & Transparency',
        description: 'Building lasting relationships through complete transparency.',
    },
];

const stats = [
    { value: '5+', label: 'Years Experience' },
    { value: '50+', label: 'Happy Clients' },
    { value: '₹100Cr+', label: 'Property Sold' },
    { value: '50+', label: 'Developer Partners' },
];

export default function About() {
    const [heroRef, heroVisible] = useScrollReveal();
    const [storyRef, storyVisible] = useScrollReveal();

    return (
        <main className="about-page">
            {/* Hero Section */}
            <section className="about-hero" ref={heroRef}>
                <div className="about-hero__bg"></div>
                <div className="container">
                    <div className={`about-hero__content ${heroVisible ? 'visible' : ''}`}>
                        <span className="about-hero__eyebrow">About Us</span>
                        <h1 className="about-hero__title">Your Trusted Real Estate Partner in Pune</h1>
                        <p className="about-hero__subtitle">
                            For over a decade, we've been helping families find their dream homes
                            and developers achieve their sales goals.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="about-stats">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <StatCard key={index} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story" ref={storyRef}>
                <div className="container">
                    <div className={`about-story__grid ${storyVisible ? 'visible' : ''}`}>
                        <div className="about-story__image">
                            <img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=500&fit=crop"
                                alt="VPP Realtech Office"
                            />
                        </div>
                        <div className="about-story__content">
                            <span className="section-eyebrow">Our Story</span>
                            <h2>Built on Trust, Driven by Results</h2>
                            <p>
                                VPP Realtech was founded with a simple belief: real estate transactions
                                should be transparent, stress-free, and rewarding for everyone involved.
                            </p>
                            <p>
                                Starting as a small advisory firm in Pune, we've grown into a trusted
                                name in the real estate industry. Our approach has always been different
                                — we focus on building relationships, not just closing deals.
                            </p>
                            <p>
                                Today, we serve two distinct segments: helping property buyers navigate
                                the complex real estate market with honest guidance, and partnering with
                                developers for exclusive mandate sales with complete accountability.
                            </p>
                            <p>
                                Our success is measured not by the number of transactions, but by the
                                trust our clients place in us, often returning for their next property
                                or referring their friends and family.
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
                                <span className="value-card__icon">{value.icon}</span>
                                <h3 className="value-card__title">{value.title}</h3>
                                <p className="value-card__description">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="about-team">
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
            </section>
        </main>
    );
}
