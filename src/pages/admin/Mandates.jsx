import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input, { Textarea, Select } from '../../components/ui/Input';
import ImageUpload from '../../components/ui/ImageUpload';
import VideoInput from '../../components/ui/VideoInput';
import { getStoredUser } from '../../services/auth';
import { getAllMandates, createMandate, updateMandate, toggleMandatePublish, deleteMandate } from '../../services/mandates';
import { AdminSidebar } from './Dashboard';
import './Admin.css';

const typeOptions = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
];

const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'ready', label: 'Ready to Move' },
    { value: 'sold-out', label: 'Sold Out' },
];

const partnershipOptions = [
    { value: 'sole-selling', label: 'Sole Selling Partner' },
    { value: 'mandate', label: 'Mandate Partner' },
    { value: 'co-selling', label: 'Co-Selling Partner' },
];

export default function AdminMandates() {
    const navigate = useNavigate();
    const [mandates, setMandates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMandate, setEditingMandate] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        developers: [''],  // Array for multiple developers
        location: '',
        address: '',
        type: '',
        status: '',
        priceRange: '',
        reraIds: [''],  // Array for multiple RERA IDs
        possession: '',
        overview: '',
        partnershipType: '',
        featured: false,
        images: [],
        videoUrl: '',
    });

    useEffect(() => {
        const user = getStoredUser();
        if (!user) {
            navigate('/admin');
            return;
        }
        loadMandates();
    }, [navigate]);

    const loadMandates = async () => {
        setLoading(true);
        const result = await getAllMandates();
        if (result.success) {
            setMandates(result.data);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openAddModal = () => {
        setEditingMandate(null);
        setFormData({
            title: '', developers: [''], location: '', address: '', type: '', status: '',
            priceRange: '', reraIds: [''], possession: '',
            overview: '', partnershipType: '', featured: false,
            images: [], videoUrl: '',
        });
        setShowModal(true);
    };

    const openEditModal = (mandate) => {
        setEditingMandate(mandate);
        // Handle both old single value and new array format
        const developers = mandate.developers || (mandate.developer ? [mandate.developer] : ['']);
        const reraIds = mandate.reraIds || (mandate.reraId ? [mandate.reraId] : ['']);

        setFormData({
            title: mandate.title || '',
            developers: developers.length > 0 ? developers : [''],
            location: mandate.location || '',
            address: mandate.address || '',
            type: mandate.type || '',
            status: mandate.status || '',
            priceRange: mandate.priceRange || '',
            reraIds: reraIds.length > 0 ? reraIds : [''],
            possession: mandate.possession || '',
            overview: mandate.overview || '',
            partnershipType: mandate.partnershipType || '',
            featured: mandate.featured || false,
            images: mandate.images || [],
            videoUrl: mandate.videoUrl || '',
        });
        setShowModal(true);
    };

    // Handle array field changes (developers, reraIds)
    const handleArrayFieldChange = (field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    };

    const addArrayField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (field, index) => {
        setFormData(prev => {
            const newArray = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: newArray.length > 0 ? newArray : [''] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        if (editingMandate) {
            const result = await updateMandate(editingMandate.id, formData);
            if (result.success) {
                await loadMandates();
                setShowModal(false);
            }
        } else {
            const result = await createMandate(formData);
            if (result.success) {
                await loadMandates();
                setShowModal(false);
            }
        }
        setSaving(false);
    };

    const handleTogglePublish = async (id) => {
        await toggleMandatePublish(id);
        await loadMandates();
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this mandate?')) {
            await deleteMandate(id);
            await loadMandates();
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Mandates</h1>
                    <Button variant="primary" onClick={openAddModal}>
                        + Add Mandate
                    </Button>
                </header>

                {loading ? (
                    <p>Loading mandates...</p>
                ) : (
                    <div className="admin-table-container">
                        {mandates.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Developer</th>
                                        <th>Location</th>
                                        <th>Partnership</th>
                                        <th>Status</th>
                                        <th>Published</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mandates.map((mandate) => (
                                        <tr key={mandate.id}>
                                            <td><strong>{mandate.title}</strong></td>
                                            <td>{mandate.developer}</td>
                                            <td>{mandate.location}</td>
                                            <td>
                                                <span className="admin-status admin-status--new">
                                                    {mandate.partnershipType === 'sole-selling' ? 'Sole Selling' :
                                                        mandate.partnershipType === 'mandate' ? 'Mandate' :
                                                            mandate.partnershipType === 'co-selling' ? 'Co-Selling' : 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`admin-status admin-status--${mandate.status === 'ready' ? 'published' : mandate.status === 'sold-out' ? 'sold' : 'draft'}`}>
                                                    {mandate.status === 'ready' ? 'Ready' : mandate.status === 'ongoing' ? 'Ongoing' : mandate.status === 'sold-out' ? 'Sold Out' : 'Upcoming'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`admin-status ${mandate.published ? 'admin-status--published' : 'admin-status--draft'}`}
                                                    onClick={() => handleTogglePublish(mandate.id)}
                                                    style={{ cursor: 'pointer', border: 'none', background: 'inherit' }}
                                                >
                                                    {mandate.published ? 'Published' : 'Draft'}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="admin-table__actions">
                                                    <button className="admin-table__action" onClick={() => openEditModal(mandate)} title="Edit">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button className="admin-table__action admin-table__action--delete" onClick={() => handleDelete(mandate.id)} title="Delete">
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
                                <div className="admin-empty__icon">📋</div>
                                <h3>No mandates yet</h3>
                                <p>Click "Add Mandate" to create your first developer partnership</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="admin-modal">
                        <div className="admin-modal__overlay" onClick={() => setShowModal(false)} />
                        <div className="admin-modal__content">
                            <div className="admin-modal__header">
                                <h2>{editingMandate ? 'Edit Mandate' : 'Add New Mandate'}</h2>
                                <button className="admin-modal__close" onClick={() => setShowModal(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <Input label="Project Title" name="title" value={formData.title} onChange={handleChange} required />

                                {/* Multiple Developers */}
                                <div className="admin-form__section">
                                    <label className="admin-form__label">Developer Name(s) *</label>
                                    {formData.developers.map((dev, index) => (
                                        <div key={index} className="admin-form__array-row">
                                            <input
                                                type="text"
                                                value={dev}
                                                onChange={(e) => handleArrayFieldChange('developers', index, e.target.value)}
                                                placeholder={`Developer ${index + 1}`}
                                                className="admin-form__input"
                                                required={index === 0}
                                            />
                                            {formData.developers.length > 1 && (
                                                <button type="button" className="admin-form__remove-btn" onClick={() => removeArrayField('developers', index)}>×</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="admin-form__add-btn" onClick={() => addArrayField('developers')}>+ Add Developer</button>
                                </div>

                                <div className="admin-form__row">
                                    <Select label="Partnership Type" name="partnershipType" value={formData.partnershipType} onChange={handleChange} options={partnershipOptions} required />
                                    <Input label="Location" name="location" value={formData.location} onChange={handleChange} required />
                                </div>

                                {/* Multiple RERA IDs */}
                                <div className="admin-form__section">
                                    <label className="admin-form__label">RERA ID(s)</label>
                                    {formData.reraIds.map((rera, index) => (
                                        <div key={index} className="admin-form__array-row">
                                            <input
                                                type="text"
                                                value={rera}
                                                onChange={(e) => handleArrayFieldChange('reraIds', index, e.target.value)}
                                                placeholder={`RERA ID ${index + 1}`}
                                                className="admin-form__input"
                                            />
                                            {formData.reraIds.length > 1 && (
                                                <button type="button" className="admin-form__remove-btn" onClick={() => removeArrayField('reraIds', index)}>×</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" className="admin-form__add-btn" onClick={() => addArrayField('reraIds')}>+ Add RERA ID</button>
                                </div>

                                <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                                <div className="admin-form__row">
                                    <Select label="Property Type" name="type" value={formData.type} onChange={handleChange} options={typeOptions} required />
                                    <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={statusOptions} required />
                                </div>
                                <div className="admin-form__row">
                                    <Input label="Price Range" name="priceRange" value={formData.priceRange} onChange={handleChange} placeholder="e.g., ₹85L - ₹1.5Cr" />
                                    <Input label="Possession" name="possession" value={formData.possession} onChange={handleChange} placeholder="e.g., Dec 2025" />
                                </div>
                                <Textarea label="Overview" name="overview" value={formData.overview} onChange={handleChange} rows={4} />

                                {/* Image Upload */}
                                <ImageUpload
                                    images={formData.images}
                                    onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                                    maxImages={10}
                                    folder="mandates"
                                />

                                {/* Video URL */}
                                <VideoInput
                                    value={formData.videoUrl}
                                    onChange={(videoUrl) => setFormData(prev => ({ ...prev, videoUrl }))}
                                />

                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                                    Featured Mandate
                                </label>
                                <div className="admin-form__actions">
                                    <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button variant="primary" type="submit" loading={saving}>
                                        {editingMandate ? 'Update Mandate' : 'Add Mandate'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
