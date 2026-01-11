/**
 * Analytics Dashboard Component
 * Shows key metrics and visualizations for admin
 */
import { useState, useEffect } from 'react';
import { SkeletonCard } from '../ui/Skeleton';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Simulate API call - replace with actual Supabase queries
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMetrics({
                leads: {
                    total: 247,
                    thisMonth: 45,
                    conversionRate: 18.5,
                    trend: 12.3,
                },
                projects: {
                    total: 24,
                    active: 18,
                    published: 22,
                    views: 8542,
                },
                traffic: {
                    pageViews: 12458,
                    uniqueVisitors: 4325,
                    avgDuration: '3:24',
                    bounceRate: 42.3,
                },
                topProjects: [
                    { id: 1, name: 'Luxury Villas Baner', views: 1245, leads: 34 },
                    { id: 2, name: 'Premium Apartments Koregaon Park', views: 967, leads: 28 },
                    { id: 3, name: 'Smart Homes Hinjewadi', views: 845, leads: 22 },
                ],
                leadSources: [
                    { source: 'Organic Search', count: 102, percentage: 41 },
                    { source: 'Direct', count: 67, percentage: 27 },
                    { source: 'Social Media', count: 48, percentage: 19 },
                    { source: 'Referral', count: 30, percentage: 13 },
                ],
            });

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="analytics-grid">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
        );
    }

    return (
        <div className="analytics-dashboard">
            <h2 className="analytics-dashboard__title">Analytics Overview</h2>

            {/* Key Metrics */}
            <div className="analytics-grid">
                {/* Leads */}
                <div className="metric-card">
                    <div className="metric-card__header">
                        <h3 className="metric-card__title">Total Leads</h3>
                        <span className={`metric-card__trend ${metrics.leads.trend > 0 ? 'metric-card__trend--up' : ''}`}>
                            {metrics.leads.trend > 0 ? '↑' : '↓'} {Math.abs(metrics.leads.trend)}%
                        </span>
                    </div>
                    <div className="metric-card__value">{metrics.leads.total}</div>
                    <div className="metric-card__subtitle">
                        {metrics.leads.thisMonth} this month
                    </div>
                    <div className="metric-card__footer">
                        <div className="metric-badge">
                            Conversion: {metrics.leads.conversionRate}%
                        </div>
                    </div>
                </div>

                {/* Projects */}
                <div className="metric-card">
                    <div className="metric-card__header">
                        <h3 className="metric-card__title">Projects</h3>
                    </div>
                    <div className="metric-card__value">{metrics.projects.total}</div>
                    <div className="metric-card__subtitle">
                        {metrics.projects.active} active • {metrics.projects.published} published
                    </div>
                    <div className="metric-card__footer">
                        <div className="metric-badge">
                            {metrics.projects.views.toLocaleString()} total views
                        </div>
                    </div>
                </div>

                {/* Page Views */}
                <div className="metric-card">
                    <div className="metric-card__header">
                        <h3 className="metric-card__title">Page Views</h3>
                    </div>
                    <div className="metric-card__value">{metrics.traffic.pageViews.toLocaleString()}</div>
                    <div className="metric-card__subtitle">
                        {metrics.traffic.uniqueVisitors.toLocaleString()} unique visitors
                    </div>
                    <div className="metric-card__footer">
                        <div className="metric-badge">
                            Avg: {metrics.traffic.avgDuration} min
                        </div>
                    </div>
                </div>

                {/* Bounce Rate */}
                <div className="metric-card">
                    <div className="metric-card__header">
                        <h3 className="metric-card__title">Bounce Rate</h3>
                    </div>
                    <div className="metric-card__value">{metrics.traffic.bounceRate}%</div>
                    <div className="metric-card__subtitle">
                        {metrics.traffic.bounceRate < 50 ? 'Good' : 'Needs improvement'}
                    </div>
                </div>
            </div>

            {/* Popular Projects */}
            <div className="analytics-section">
                <h3 className="analytics-section__title">Top Performing Projects</h3>
                <div className="table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Views</th>
                                <th>Leads</th>
                                <th>Conversion Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.topProjects.map((project) => (
                                <tr key={project.id}>
                                    <td className="data-table__name">{project.name}</td>
                                    <td>{project.views.toLocaleString()}</td>
                                    <td>{project.leads}</td>
                                    <td>
                                        <span className="conversion-badge">
                                            {((project.leads / project.views) * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Traffic Sources */}
            <div className="analytics-section">
                <h3 className="analytics-section__title">Lead Sources</h3>
                <div className="sources-grid">
                    {metrics.leadSources.map((source) => (
                        <div key={source.source} className="source-card">
                            <div className="source-card__header">
                                <span className="source-card__name">{source.source}</span>
                                <span className="source-card__count">{source.count}</span>
                            </div>
                            <div className="source-card__bar">
                                <div
                                    className="source-card__fill"
                                    style={{ width: `${source.percentage}%` }}
                                />
                            </div>
                            <div className="source-card__percentage">{source.percentage}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
