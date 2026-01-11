import { Router } from 'express';
import { getLeads, saveLeads, generateId, getProjects } from '../utils/database.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { sendEmail, getBuyerEnquiryEmail, getDeveloperEnquiryEmail, getConfirmationEmail } from '../utils/email.js';

const router = Router();

// GET /api/leads - Get all leads (admin)
router.get('/', authenticate, adminOnly, (req, res) => {
    try {
        const leads = getLeads();
        const { type, status, sort } = req.query;

        let filteredLeads = [...leads];

        // Apply filters
        if (type) {
            filteredLeads = filteredLeads.filter(l => l.type === type);
        }
        if (status) {
            filteredLeads = filteredLeads.filter(l => l.status === status);
        }

        // Sort by date (newest first by default)
        filteredLeads.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sort === 'asc' ? dateA - dateB : dateB - dateA;
        });

        res.json({
            success: true,
            data: filteredLeads,
            count: filteredLeads.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch leads',
        });
    }
});

// GET /api/leads/stats - Get lead statistics (admin)
router.get('/stats', authenticate, adminOnly, (req, res) => {
    try {
        const leads = getLeads();

        const stats = {
            total: leads.length,
            new: leads.filter(l => l.status === 'new').length,
            contacted: leads.filter(l => l.status === 'contacted').length,
            buyers: leads.filter(l => l.type === 'buyer').length,
            developers: leads.filter(l => l.type === 'developer').length,
            thisWeek: leads.filter(l => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(l.createdAt) >= weekAgo;
            }).length,
        };

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lead stats',
        });
    }
});

// GET /api/leads/:id - Get single lead (admin)
router.get('/:id', authenticate, adminOnly, (req, res) => {
    try {
        const { id } = req.params;
        const leads = getLeads();
        const lead = leads.find(l => l.id === id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found',
            });
        }

        res.json({
            success: true,
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lead',
        });
    }
});

// POST /api/leads - Create new lead (public)
router.post('/', async (req, res) => {
    try {
        const leads = getLeads();
        const {
            name,
            email,
            phone,
            type,
            projectId,
            budget,
            propertyType,
            preferredLocation,
            message,
            company,
            projectName: devProjectName,
            projectLocation,
            source,
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                error: 'Name and phone are required',
            });
        }

        // Get project name if projectId provided
        let projectName = null;
        if (projectId) {
            const projects = getProjects();
            const project = projects.find(p => p.id === projectId);
            if (project) {
                projectName = project.title;
            }
        }

        const newLead = {
            id: generateId('lead'),
            name,
            email: email || '',
            phone,
            type: type || 'buyer',
            projectId: projectId || null,
            projectName,
            budget: budget || null,
            propertyType: propertyType || null,
            preferredLocation: preferredLocation || null,
            message: message || '',
            company: company || null,
            source: source || 'website',
            status: 'new',
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        leads.push(newLead);
        saveLeads(leads);

        // Send email notifications (async, don't wait)
        const leadType = type || 'buyer';

        if (leadType === 'buyer') {
            const adminEmail = getBuyerEnquiryEmail({
                name,
                email,
                phone,
                budget,
                propertyType,
                location: preferredLocation,
                message,
                projectName,
            });
            sendEmail({ to: process.env.ADMIN_EMAIL, ...adminEmail });
        } else {
            const adminEmail = getDeveloperEnquiryEmail({
                name,
                company,
                email,
                phone,
                projectName: devProjectName,
                projectLocation,
                message,
            });
            sendEmail({ to: process.env.ADMIN_EMAIL, ...adminEmail });
        }

        // Send confirmation to user
        if (email) {
            const confirmEmail = getConfirmationEmail({ name, type: leadType });
            sendEmail({ to: email, ...confirmEmail });
        }

        res.status(201).json({
            success: true,
            message: 'Thank you! We will contact you shortly.',
            data: { id: newLead.id },
        });
    } catch (error) {
        console.error('Create lead error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit enquiry',
        });
    }
});

// PATCH /api/leads/:id/status - Update lead status (admin)
router.patch('/:id/status', authenticate, adminOnly, (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['new', 'contacted', 'qualified', 'closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Valid status is required',
            });
        }

        const leads = getLeads();
        const index = leads.findIndex(l => l.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found',
            });
        }

        leads[index].status = status;
        leads[index].updatedAt = new Date().toISOString();
        saveLeads(leads);

        res.json({
            success: true,
            data: leads[index],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update lead',
        });
    }
});

// PUT /api/leads/:id - Update lead notes (admin)
router.put('/:id', authenticate, adminOnly, (req, res) => {
    try {
        const { id } = req.params;
        const { notes, status } = req.body;

        const leads = getLeads();
        const index = leads.findIndex(l => l.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found',
            });
        }

        if (notes !== undefined) {
            leads[index].notes = notes;
        }
        if (status) {
            leads[index].status = status;
        }
        leads[index].updatedAt = new Date().toISOString();
        saveLeads(leads);

        res.json({
            success: true,
            data: leads[index],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update lead',
        });
    }
});

// DELETE /api/leads/:id - Delete lead (admin)
router.delete('/:id', authenticate, adminOnly, (req, res) => {
    try {
        const { id } = req.params;
        const leads = getLeads();
        const index = leads.findIndex(l => l.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found',
            });
        }

        leads.splice(index, 1);
        saveLeads(leads);

        res.json({
            success: true,
            message: 'Lead deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete lead',
        });
    }
});

export default router;
