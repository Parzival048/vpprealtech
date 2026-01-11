import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { getStoredUser } from '../../services/auth';
import { getLeads, updateLeadStatus, deleteLead } from '../../services/leads';
import { AdminSidebar } from './Dashboard';
import './Admin.css';

const typeFilterOptions = [
    { value: '', label: 'All Types' },
    { value: 'buyer', label: 'Buyers' },
    { value: 'developer', label: 'Developers' },
    { value: 'contact', label: 'Contact Form' },
];

const statusFilterOptions = [
    { value: '', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
];

export default function AdminLeads() {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: '', status: '' });
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        const user = getStoredUser();
        if (!user) {
            navigate('/admin');
            return;
        }
        loadLeads();
    }, [navigate]);

    const loadLeads = async () => {
        setLoading(true);
        const result = await getLeads(filters);
        if (result.success) {
            setLeads(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!loading) {
            loadLeads();
        }
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = async (id, newStatus) => {
        await updateLeadStatus(id, newStatus);
        setLeads((prev) =>
            prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        );
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            await deleteLead(id);
            setLeads((prev) => prev.filter((lead) => lead.id !== id));
            if (selectedLead?.id === id) {
                setSelectedLead(null);
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Leads</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            options={typeFilterOptions}
                        />
                        <Select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            options={statusFilterOptions}
                        />
                    </div>
                </header>

                {loading ? (
                    <p>Loading leads...</p>
                ) : (
                    <div className="admin-table-container">
                        {leads.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Type</th>
                                        <th>Interest</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => (
                                        <tr key={lead.id}>
                                            <td>
                                                <strong>{lead.name}</strong>
                                                <br />
                                                <small style={{ color: 'var(--text-muted)' }}>{lead.email}</small>
                                            </td>
                                            <td>{lead.phone}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{lead.type}</td>
                                            <td>{lead.projectName || lead.enquiryType || 'General'}</td>
                                            <td>
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className={`admin-status admin-status--${lead.status}`}
                                                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: '0.25rem 0.5rem' }}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                </select>
                                            </td>
                                            <td>{formatDate(lead.createdAt)}</td>
                                            <td>
                                                <div className="admin-table__actions">
                                                    <button
                                                        className="admin-table__action"
                                                        onClick={() => setSelectedLead(lead)}
                                                        title="View Details"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="admin-table__action admin-table__action--delete"
                                                        onClick={() => handleDelete(lead.id)}
                                                        title="Delete"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="admin-empty">
                                <div className="admin-empty__icon">📭</div>
                                <h3>No leads found</h3>
                                <p>{filters.type || filters.status ? 'Try adjusting your filters' : 'Leads will appear here when users submit forms'}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Lead Detail Modal */}
                {selectedLead && (
                    <div className="admin-modal">
                        <div className="admin-modal__overlay" onClick={() => setSelectedLead(null)} />
                        <div className="admin-modal__content">
                            <div className="admin-modal__header">
                                <h2>Lead Details</h2>
                                <button className="admin-modal__close" onClick={() => setSelectedLead(null)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div><strong>Name:</strong> {selectedLead.name}</div>
                                <div><strong>Email:</strong> <a href={`mailto:${selectedLead.email}`}>{selectedLead.email || 'N/A'}</a></div>
                                <div><strong>Phone:</strong> <a href={`tel:${selectedLead.phone}`}>{selectedLead.phone}</a></div>
                                <div><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedLead.type}</span></div>
                                <div><strong>Interested In:</strong> {selectedLead.projectName || selectedLead.enquiryType || 'General Inquiry'}</div>
                                {selectedLead.budget && <div><strong>Budget:</strong> {selectedLead.budget}</div>}
                                {selectedLead.preferredLocation && <div><strong>Location:</strong> {selectedLead.preferredLocation}</div>}
                                <div>
                                    <strong>Message:</strong>
                                    <p style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                        {selectedLead.message || 'No message provided'}
                                    </p>
                                </div>
                                <div><strong>Date:</strong> {formatDate(selectedLead.createdAt)}</div>
                            </div>
                            <div className="admin-form__actions">
                                <Button variant="ghost" onClick={() => setSelectedLead(null)}>Close</Button>
                                <Button
                                    variant="whatsapp"
                                    onClick={() => window.open(`https://wa.me/${selectedLead.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
                                >
                                    WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
