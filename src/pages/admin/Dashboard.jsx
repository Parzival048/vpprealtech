import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut, getStoredUser, onAuthChange } from '../../services/auth';
import { getAllProjects } from '../../services/projects';
import { getLeads, getLeadStats } from '../../services/leads';
import './Admin.css';

// Sidebar component
function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/admin');
    };

    return (
        <aside className="admin-sidebar">
            <Link to="/admin/dashboard" className="admin-sidebar__logo">
                <span className="admin-sidebar__logo-icon">
                    <svg viewBox="0 0 40 40" fill="none">
                        <rect x="5" y="15" width="10" height="20" rx="1" fill="currentColor" />
                        <rect x="17" y="8" width="10" height="27" rx="1" fill="currentColor" opacity="0.8" />
                        <rect x="29" y="12" width="8" height="23" rx="1" fill="currentColor" opacity="0.6" />
                    </svg>
                </span>
                <span className="admin-sidebar__logo-text">VPP Admin</span>
            </Link>

            <nav className="admin-sidebar__nav">
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                    }
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/admin/projects"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                    }
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Projects</span>
                </NavLink>

                <NavLink
                    to="/admin/blogs"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                    }
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>Blogs</span>
                </NavLink>

                <NavLink
                    to="/admin/leads"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                    }
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Leads</span>
                </NavLink>

                <Link to="/" className="admin-sidebar__link" target="_blank">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span>View Site</span>
                </Link>
            </nav>

            <button className="admin-sidebar__logout" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
            </button>
        </aside>
    );
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalProjects: 0,
        publishedProjects: 0,
        totalLeads: 0,
        newLeads: 0,
    });
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = getStoredUser();
        if (!storedUser) {
            navigate('/admin');
            return;
        }
        setUser(storedUser);

        // Load data
        async function loadData() {
            try {
                // Get projects
                const projectsResult = await getAllProjects();
                if (projectsResult.success) {
                    const projects = projectsResult.data;
                    setStats(prev => ({
                        ...prev,
                        totalProjects: projects.length,
                        publishedProjects: projects.filter(p => p.published).length,
                    }));
                }

                // Get lead stats
                const statsResult = await getLeadStats();
                if (statsResult.success) {
                    setStats(prev => ({
                        ...prev,
                        totalLeads: statsResult.data.total,
                        newLeads: statsResult.data.new,
                    }));
                }

                // Get recent leads
                const leadsResult = await getLeads();
                if (leadsResult.success) {
                    setRecentLeads(leadsResult.data.slice(0, 5));
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="admin-dashboard">
                <AdminSidebar />
                <main className="admin-main">
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <AdminSidebar />

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Dashboard</h1>
                    <div className="admin-header__user">
                        <span>Welcome, {user?.name || 'Admin'}</span>
                        <div className="admin-header__avatar">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <div className="admin-stat-card__label">Total Projects</div>
                        <div className="admin-stat-card__value">{stats.totalProjects}</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-card__label">Published</div>
                        <div className="admin-stat-card__value">{stats.publishedProjects}</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-card__label">Total Leads</div>
                        <div className="admin-stat-card__value">{stats.totalLeads}</div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-card__label">New Leads</div>
                        <div className="admin-stat-card__value">{stats.newLeads}</div>
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h2>Recent Leads</h2>
                        <Link to="/admin/leads" className="btn btn-outline btn-sm">
                            View All
                        </Link>
                    </div>
                    {recentLeads.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Type</th>
                                    <th>Interest</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLeads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td>{lead.name}</td>
                                        <td>{lead.phone}</td>
                                        <td>{lead.type}</td>
                                        <td>{lead.projectName || 'General'}</td>
                                        <td>
                                            <span className={`admin-status admin-status--${lead.status}`}>
                                                {lead.status === 'new' ? 'New' : 'Contacted'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="admin-empty">
                            <div className="admin-empty__icon">📭</div>
                            <h3>No leads yet</h3>
                            <p>Leads will appear here when users submit forms</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export { AdminSidebar };
