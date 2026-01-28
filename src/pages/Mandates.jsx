import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Select } from '../components/ui/Input';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getMandates } from '../services/mandates';

const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'Baner', label: 'Baner' },
    { value: 'Hinjewadi', label: 'Hinjewadi' },
    { value: 'Kharadi', label: 'Kharadi' },
    { value: 'Wakad', label: 'Wakad' },
    { value: 'Viman Nagar', label: 'Viman Nagar' },
    { value: 'Koregaon Park', label: 'Koregaon Park' },
];

const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
];

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'ready', label: 'Ready to Move' },
];

const styles = {
    page: {
        minHeight: '100vh',
        background: '#f8f9fa',
    },
    header: {
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '8rem 2rem 4rem',
        textAlign: 'center',
        color: '#ffffff',
        position: 'relative',
        zIndex: 1,
    },
    headerTitle: {
        fontSize: '3rem',
        fontWeight: '800',
        marginBottom: '1rem',
        color: '#ffffff',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
    },
    headerSubtitle: {
        opacity: 0.9,
        maxWidth: '600px',
        margin: '0 auto',
        fontSize: '1.125rem',
        lineHeight: 1.6,
        color: '#cbd5e1',
        fontWeight: '400',
    },
    filters: {
        background: 'white',
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #e8e8ee',
    },
    filtersGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    listing: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    count: {
        marginBottom: '1.5rem',
        color: '#666',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cardImage: {
        height: '200px',
        background: 'linear-gradient(135deg, #E8F4F8 0%, #FFE5DB 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    placeholder: {
        fontSize: '48px',
    },
    badge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: 'white',
        textTransform: 'capitalize',
    },
    partnerBadge: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        color: 'white',
        background: '#8B5CF6',
    },
    cardContent: {
        padding: '20px',
        flex: 1,
    },
    cardType: {
        fontSize: '12px',
        color: '#FF6B35',
        fontWeight: '600',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#1A1A2E',
        margin: '0 0 8px 0',
        lineHeight: 1.3,
    },
    cardDeveloper: {
        fontSize: '14px',
        color: '#8B5CF6',
        margin: '0 0 8px 0',
        fontWeight: '500',
    },
    cardLocation: {
        fontSize: '14px',
        color: '#666',
        margin: '0 0 8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    cardPrice: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#FF6B35',
        margin: '0',
    },
    cardFooter: {
        padding: '16px 20px',
        borderTop: '1px solid #eee',
        background: '#fafafa',
        color: '#FF6B35',
        fontWeight: '600',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    empty: {
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'white',
        borderRadius: '16px',
    },
};

const getBadgeColor = (status) => {
    switch (status) {
        case 'ongoing': return '#FFA500';
        case 'ready': return '#22C55E';
        case 'upcoming': return '#3B82F6';
        default: return '#888';
    }
};

const getPartnerLabel = (type) => {
    switch (type) {
        case 'sole-selling': return 'Sole Selling';
        case 'mandate': return 'Mandate';
        case 'co-selling': return 'Co-Selling';
        default: return 'Partner';
    }
};

export default function Mandates() {
    const [allMandates, setAllMandates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: '',
        type: '',
        status: '',
    });

    const [headerRef, headerVisible] = useScrollReveal();

    useEffect(() => {
        async function loadMandates() {
            const result = await getMandates();
            if (result.success && result.data) {
                setAllMandates(result.data);
            }
            setLoading(false);
        }
        loadMandates();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredMandates = useMemo(() => {
        return allMandates.filter((mandate) => {
            if (filters.location && mandate.location !== filters.location) return false;
            if (filters.type && mandate.type !== filters.type) return false;
            if (filters.status && mandate.status !== filters.status) return false;
            return true;
        });
    }, [filters, allMandates]);

    const resetFilters = () => {
        setFilters({ location: '', type: '', status: '' });
    };

    const hasActiveFilters = Object.values(filters).some((v) => v !== '');

    return (
        <main style={styles.page}>
            {/* Header */}
            <section style={styles.header} ref={headerRef}>
                <h1 style={styles.headerTitle}>Our Mandates</h1>
                <p style={styles.headerSubtitle}>
                    Exclusive developer partnerships and sole selling mandates across Pune's premium locations.
                </p>
            </section>

            {/* Filters */}
            <section style={styles.filters}>
                <div style={styles.filtersGrid}>
                    <Select
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        options={locationOptions}
                        placeholder="Location"
                    />
                    <Select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        options={typeOptions}
                        placeholder="Property Type"
                    />
                    <Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        options={statusOptions}
                        placeholder="Status"
                    />
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#FF6B35',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </section>

            {/* Mandates Grid */}
            <section style={styles.listing}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>Loading mandates...</p>
                ) : filteredMandates.length > 0 ? (
                    <>
                        <p style={styles.count}>
                            Showing <strong>{filteredMandates.length}</strong> {filteredMandates.length === 1 ? 'mandate' : 'mandates'}
                        </p>
                        <div style={styles.grid}>
                            {filteredMandates.map((mandate) => (
                                <Link
                                    key={mandate.id}
                                    to={`/mandates/${mandate.slug || mandate.id}`}
                                    style={styles.card}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    {/* Image Area */}
                                    <div style={styles.cardImage}>
                                        {mandate.images && mandate.images[0] ? (
                                            <img
                                                src={mandate.images[0]}
                                                alt={mandate.title}
                                                style={styles.img}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <span style={styles.placeholder}>🏗️</span>
                                        )}
                                        {mandate.status && (
                                            <span style={{ ...styles.badge, background: getBadgeColor(mandate.status) }}>
                                                {mandate.status}
                                            </span>
                                        )}
                                        {mandate.partnershipType && (
                                            <span style={styles.partnerBadge}>
                                                {getPartnerLabel(mandate.partnershipType)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div style={styles.cardContent}>
                                        <div style={styles.cardType}>{mandate.type || 'Property'}</div>
                                        <h3 style={styles.cardTitle}>{mandate.title}</h3>
                                        {mandate.developer && (
                                            <p style={styles.cardDeveloper}>by {mandate.developer}</p>
                                        )}
                                        <p style={styles.cardLocation}>
                                            📍 {mandate.location || 'Pune'}
                                        </p>
                                        {mandate.priceRange && (
                                            <p style={styles.cardPrice}>{mandate.priceRange}</p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div style={styles.cardFooter}>
                                        View Details
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={styles.empty}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏗️</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Mandates Found</h3>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>Try adjusting your filters to see more mandates.</p>
                        <button
                            onClick={resetFilters}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#FF6B35',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
