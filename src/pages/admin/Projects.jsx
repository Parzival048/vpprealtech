import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input, { Textarea, Select } from '../../components/ui/Input';
import ImageUpload from '../../components/ui/ImageUpload';
import VideoInput from '../../components/ui/VideoInput';
import { getStoredUser } from '../../services/auth';
import { getAllProjects, createProject, updateProject, toggleProjectPublish, deleteProject } from '../../services/projects';
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
];

const budgetOptions = [
    { value: 'under-50l', label: 'Under ₹50 Lakhs' },
    { value: '50l-1cr', label: '₹50L - ₹1 Crore' },
    { value: '1cr-2cr', label: '₹1Cr - ₹2 Crore' },
    { value: '2cr-5cr', label: '₹2Cr - ₹5 Crore' },
    { value: 'above-5cr', label: 'Above ₹5 Crore' },
];

export default function AdminProjects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        address: '',
        type: '',
        status: '',
        priceRange: '',
        developer: '',
        reraId: '',
        possession: '',
        overview: '',
        budgetCategory: '',
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
        loadProjects();
    }, [navigate]);

    const loadProjects = async () => {
        setLoading(true);
        const result = await getAllProjects();
        if (result.success) {
            setProjects(result.data);
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
        setEditingProject(null);
        setFormData({
            title: '', location: '', address: '', type: '', status: '',
            priceRange: '', developer: '', reraId: '', possession: '',
            overview: '', budgetCategory: '', featured: false,
            images: [], videoUrl: '',
        });
        setShowModal(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title || '',
            location: project.location || '',
            address: project.address || '',
            type: project.type || '',
            status: project.status || '',
            priceRange: project.priceRange || '',
            developer: project.developer || '',
            reraId: project.reraId || '',
            possession: project.possession || '',
            overview: project.overview || '',
            budgetCategory: project.budgetCategory || '',
            featured: project.featured || false,
            images: project.images || [],
            videoUrl: project.videoUrl || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        if (editingProject) {
            const result = await updateProject(editingProject.id, formData);
            if (result.success) {
                await loadProjects();
                setShowModal(false);
            }
        } else {
            const result = await createProject(formData);
            if (result.success) {
                await loadProjects();
                setShowModal(false);
            }
        }
        setSaving(false);
    };

    const handleTogglePublish = async (id) => {
        await toggleProjectPublish(id);
        await loadProjects();
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            await deleteProject(id);
            await loadProjects();
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Projects</h1>
                    <Button variant="primary" onClick={openAddModal}>
                        + Add Project
                    </Button>
                </header>

                {loading ? (
                    <p>Loading projects...</p>
                ) : (
                    <div className="admin-table-container">
                        {projects.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Location</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Published</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td><strong>{project.title}</strong></td>
                                            <td>{project.location}</td>
                                            <td>{project.type}</td>
                                            <td>
                                                <span className={`admin-status admin-status--${project.status === 'ready' ? 'published' : 'draft'}`}>
                                                    {project.status === 'ready' ? 'Ready' : project.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`admin-status ${project.published ? 'admin-status--published' : 'admin-status--draft'}`}
                                                    onClick={() => handleTogglePublish(project.id)}
                                                    style={{ cursor: 'pointer', border: 'none', background: 'inherit' }}
                                                >
                                                    {project.published ? 'Published' : 'Draft'}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="admin-table__actions">
                                                    <button className="admin-table__action" onClick={() => openEditModal(project)} title="Edit">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button className="admin-table__action admin-table__action--delete" onClick={() => handleDelete(project.id)} title="Delete">
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
                                <div className="admin-empty__icon">🏠</div>
                                <h3>No projects yet</h3>
                                <p>Click "Add Project" to create your first project</p>
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
                                <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                                <button className="admin-modal__close" onClick={() => setShowModal(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <Input label="Project Title" name="title" value={formData.title} onChange={handleChange} required />
                                <div className="admin-form__row">
                                    <Input label="Location" name="location" value={formData.location} onChange={handleChange} required />
                                    <Input label="Developer" name="developer" value={formData.developer} onChange={handleChange} />
                                </div>
                                <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                                <div className="admin-form__row">
                                    <Select label="Property Type" name="type" value={formData.type} onChange={handleChange} options={typeOptions} required />
                                    <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={statusOptions} required />
                                </div>
                                <div className="admin-form__row">
                                    <Input label="Price Range" name="priceRange" value={formData.priceRange} onChange={handleChange} placeholder="e.g., ₹85L - ₹1.5Cr" />
                                    <Select label="Budget Category" name="budgetCategory" value={formData.budgetCategory} onChange={handleChange} options={budgetOptions} />
                                </div>
                                <div className="admin-form__row">
                                    <Input label="RERA ID" name="reraId" value={formData.reraId} onChange={handleChange} />
                                    <Input label="Possession" name="possession" value={formData.possession} onChange={handleChange} placeholder="e.g., Dec 2025" />
                                </div>
                                <Textarea label="Overview" name="overview" value={formData.overview} onChange={handleChange} rows={4} />

                                {/* Image Upload */}
                                <ImageUpload
                                    images={formData.images}
                                    onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                                    maxImages={10}
                                    folder="projects"
                                />

                                {/* Video URL */}
                                <VideoInput
                                    value={formData.videoUrl}
                                    onChange={(videoUrl) => setFormData(prev => ({ ...prev, videoUrl }))}
                                />

                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                                    Featured Project
                                </label>
                                <div className="admin-form__actions">
                                    <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button variant="primary" type="submit" loading={saving}>
                                        {editingProject ? 'Update Project' : 'Add Project'}
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
