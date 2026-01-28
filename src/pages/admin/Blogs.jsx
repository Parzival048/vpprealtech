import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input, { Textarea, Select } from '../../components/ui/Input';
import ImageUpload from '../../components/ui/ImageUpload';
import { getStoredUser } from '../../services/auth';
import { getAllBlogs, createBlog, updateBlog, toggleBlogPublish, deleteBlog } from '../../services/blogs';
import { AdminSidebar } from './Dashboard';
import './Admin.css';

const categoryOptions = [
    { value: 'buyer-insights', label: 'Buyer Insights' },
    { value: 'micro-market-deep-dives', label: 'Micro-Market Deep Dives' },
    { value: 'market-intelligence', label: 'Market Intelligence' },
    { value: 'data-snapshots', label: 'Data Snapshots' },
    { value: 'buyer-mistakes', label: 'Buyer Mistakes' },
    { value: 'developer-playbook', label: 'Developer Playbook' },
    { value: 'opinion', label: 'Opinion' },
    { value: 'market-trends', label: 'Market Trends' },
    { value: 'buying-tips', label: 'Buying Tips' },
    { value: 'investment', label: 'Investment' },
    { value: 'legal', label: 'Legal & Documentation' },
    { value: 'news', label: 'News & Updates' },
];

export default function AdminBlogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        featuredImage: '',
        galleryImages: [],
        sourceLink: '',
    });

    useEffect(() => {
        const user = getStoredUser();
        if (!user) {
            navigate('/admin');
            return;
        }
        loadBlogs();
    }, [navigate]);

    const loadBlogs = async () => {
        setLoading(true);
        const result = await getAllBlogs();
        if (result.success) {
            setBlogs(result.data);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingBlog(null);
        setFormData({
            title: '', excerpt: '', content: '', category: '',
            author: '', featuredImage: '', galleryImages: [], sourceLink: '',
        });
        setShowModal(true);
    };

    const openEditModal = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            category: blog.category || '',
            author: blog.author || '',
            featuredImage: blog.featuredImage || '',
            galleryImages: blog.galleryImages || [],
            sourceLink: blog.sourceLink || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        if (editingBlog) {
            const result = await updateBlog(editingBlog.id, formData);
            if (result.success) {
                await loadBlogs();
                setShowModal(false);
            }
        } else {
            const result = await createBlog(formData);
            if (result.success) {
                await loadBlogs();
                setShowModal(false);
            }
        }
        setSaving(false);
    };

    const handleTogglePublish = async (id) => {
        await toggleBlogPublish(id);
        await loadBlogs();
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            await deleteBlog(id);
            await loadBlogs();
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Get category label for display
    const getCategoryLabel = (value) => {
        const category = categoryOptions.find(opt => opt.value === value);
        return category ? category.label : value || '-';
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Blog Posts</h1>
                    <Button variant="primary" onClick={openAddModal}>
                        + New Post
                    </Button>
                </header>

                {loading ? (
                    <p>Loading blogs...</p>
                ) : (
                    <div className="admin-table-container">
                        {blogs.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Published</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs.map((blog) => (
                                        <tr key={blog.id}>
                                            <td><strong>{blog.title}</strong></td>
                                            <td>{getCategoryLabel(blog.category)}</td>
                                            <td>{formatDate(blog.createdAt)}</td>
                                            <td>
                                                <button
                                                    className={`admin-status ${blog.published ? 'admin-status--published' : 'admin-status--draft'}`}
                                                    onClick={() => handleTogglePublish(blog.id)}
                                                    style={{ cursor: 'pointer', border: 'none', background: 'inherit' }}
                                                >
                                                    {blog.published ? 'Published' : 'Draft'}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="admin-table__actions">
                                                    <button className="admin-table__action" onClick={() => openEditModal(blog)} title="Edit">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button className="admin-table__action admin-table__action--delete" onClick={() => handleDelete(blog.id)} title="Delete">
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
                                <div className="admin-empty__icon">📝</div>
                                <h3>No blog posts yet</h3>
                                <p>Click "New Post" to create your first blog article</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="admin-modal">
                        <div className="admin-modal__overlay" onClick={() => setShowModal(false)} />
                        <div className="admin-modal__content admin-modal__content--large">
                            <div className="admin-modal__header">
                                <h2>{editingBlog ? 'Edit Blog Post' : 'New Blog Post'}</h2>
                                <button className="admin-modal__close" onClick={() => setShowModal(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
                                <div className="admin-form__row">
                                    <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={categoryOptions} />
                                    <Input label="Author" name="author" value={formData.author} onChange={handleChange} placeholder="VPP Realtech" />
                                </div>
                                <Textarea label="Excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} placeholder="Brief summary of the article..." />
                                <Textarea label="Content (HTML supported)" name="content" value={formData.content} onChange={handleChange} rows={10} placeholder="Write your blog content here. Use HTML tags for formatting:&#10;&#10;<h2>Heading</h2>&#10;<p>Paragraph text</p>&#10;<ul><li>List item</li></ul>&#10;<strong>Bold text</strong>" required />

                                {/* Source Link */}
                                <Input
                                    label="Source Link (Optional)"
                                    name="sourceLink"
                                    value={formData.sourceLink}
                                    onChange={handleChange}
                                    placeholder="https://example.com/original-article"
                                    type="url"
                                />

                                {/* Featured Image */}
                                <div className="admin-form__section">
                                    <label className="admin-form__label">Featured Image (Main Cover)</label>
                                    <ImageUpload
                                        images={formData.featuredImage ? [formData.featuredImage] : []}
                                        onImagesChange={(images) => setFormData(prev => ({ ...prev, featuredImage: images[0] || '' }))}
                                        maxImages={1}
                                        folder="blogs"
                                    />
                                </div>

                                {/* Gallery Images */}
                                <div className="admin-form__section">
                                    <label className="admin-form__label">Gallery Images (Additional Images)</label>
                                    <p className="admin-form__hint">Add multiple images to create a professional image gallery in your blog post.</p>
                                    <ImageUpload
                                        images={formData.galleryImages || []}
                                        onImagesChange={(images) => setFormData(prev => ({ ...prev, galleryImages: images }))}
                                        maxImages={10}
                                        folder="blogs"
                                    />
                                </div>

                                <div className="admin-form__actions">
                                    <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button variant="primary" type="submit" loading={saving}>
                                        {editingBlog ? 'Update Post' : 'Create Post'}
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
