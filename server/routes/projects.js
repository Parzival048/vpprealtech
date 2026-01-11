import { Router } from 'express';
import { getProjects, saveProjects, generateId, generateSlug } from '../utils/database.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/projects - Get all published projects (public)
router.get('/', (req, res) => {
    try {
        const projects = getProjects();
        const {
            location,
            type,
            status,
            budget,
            featured,
            limit
        } = req.query;

        let filteredProjects = projects.filter(p => p.published);

        // Apply filters
        if (location) {
            filteredProjects = filteredProjects.filter(p =>
                p.location.toLowerCase() === location.toLowerCase()
            );
        }
        if (type) {
            filteredProjects = filteredProjects.filter(p =>
                p.type.toLowerCase() === type.toLowerCase()
            );
        }
        if (status) {
            filteredProjects = filteredProjects.filter(p => p.status === status);
        }
        if (budget) {
            filteredProjects = filteredProjects.filter(p => p.budgetCategory === budget);
        }
        if (featured === 'true') {
            filteredProjects = filteredProjects.filter(p => p.featured);
        }
        if (limit) {
            filteredProjects = filteredProjects.slice(0, parseInt(limit));
        }

        res.json({
            success: true,
            data: filteredProjects,
            count: filteredProjects.length,
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch projects',
        });
    }
});

// GET /api/projects/all - Get all projects (admin)
router.get('/all', authenticate, adminOnly, (req, res) => {
    try {
        const projects = getProjects();
        res.json({
            success: true,
            data: projects,
            count: projects.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch projects',
        });
    }
});

// GET /api/projects/featured - Get featured projects (public)
router.get('/featured', (req, res) => {
    try {
        const projects = getProjects();
        const featuredProjects = projects.filter(p => p.published && p.featured);

        res.json({
            success: true,
            data: featuredProjects,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch featured projects',
        });
    }
});

// GET /api/projects/:slug - Get single project by slug (public)
router.get('/:slug', (req, res) => {
    try {
        const { slug } = req.params;
        const projects = getProjects();
        const project = projects.find(p => p.slug === slug && p.published);

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found',
            });
        }

        res.json({
            success: true,
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch project',
        });
    }
});

// POST /api/projects - Create new project (admin)
router.post('/', authenticate, adminOnly, (req, res) => {
    try {
        const projects = getProjects();
        const {
            title,
            location,
            address,
            type,
            status,
            priceRange,
            developer,
            reraId,
            possession,
            configurations,
            sizes,
            amenities,
            overview,
            highlights,
            images,
            budgetCategory,
            featured,
        } = req.body;

        if (!title || !location || !type || !status) {
            return res.status(400).json({
                success: false,
                error: 'Title, location, type, and status are required',
            });
        }

        // Generate unique slug
        let slug = generateSlug(title);
        let slugExists = projects.some(p => p.slug === slug);
        if (slugExists) {
            slug = `${slug}-${Date.now().toString(36)}`;
        }

        const newProject = {
            id: generateId('proj'),
            slug,
            title,
            location,
            address: address || '',
            type,
            status,
            priceRange: priceRange || '',
            developer: developer || '',
            reraId: reraId || '',
            possession: possession || '',
            configurations: configurations || [],
            sizes: sizes || '',
            amenities: amenities || [],
            overview: overview || '',
            highlights: highlights || [],
            images: images || [],
            budgetCategory: budgetCategory || '',
            published: false,
            featured: featured || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        projects.push(newProject);
        saveProjects(projects);

        res.status(201).json({
            success: true,
            data: newProject,
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create project',
        });
    }
});

// PUT /api/projects/:id - Update project (admin)
router.put('/:id', authenticate, adminOnly, (req, res) => {
    try {
        const { id } = req.params;
        const projects = getProjects();
        const index = projects.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Project not found',
            });
        }

        const updatedProject = {
            ...projects[index],
            ...req.body,
            id: projects[index].id, // Prevent ID change
            slug: projects[index].slug, // Prevent slug change
            createdAt: projects[index].createdAt,
            updatedAt: new Date().toISOString(),
        };

        projects[index] = updatedProject;
        saveProjects(projects);

        res.json({
            success: true,
            data: updatedProject,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update project',
        });
    }
});

// PATCH /api/projects/:id/publish - Toggle publish status (admin)
router.patch('/:id/publish', authenticate, adminOnly, (req, res) => {
    try {
        const { id } = req.params;
        const projects = getProjects();
        const index = projects.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Project not found',
            });
        }

        projects[index].published = !projects[index].published;
        projects[index].updatedAt = new Date().toISOString();
        saveProjects(projects);

        res.json({
            success: true,
            data: projects[index],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update project',
        });
    }
});

// DELETE /api/projects/:id - Delete project (admin)
router.delete('/:id', authenticate, adminOnly, (req, res) => {
    try {
        const { id } = req.params;
        const projects = getProjects();
        const index = projects.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Project not found',
            });
        }

        projects.splice(index, 1);
        saveProjects(projects);

        res.json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete project',
        });
    }
});

export default router;
