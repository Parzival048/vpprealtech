/**
 * Supabase Service for Leads & Contact
 */
import { supabase } from './supabase';

// Get all leads (admin)
export async function getLeads(filters = {}) {
    try {
        let query = supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.type) {
            query = query.eq('source', filters.type === 'buyer' ? 'website' : filters.type); // Adjust mapping as needed
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Get leads error:', error);
            return { success: false, error: error.message };
        }

        const leads = (data || []).map(transformLead);
        return { success: true, data: leads };
    } catch (error) {
        console.error('Get leads error:', error);
        return { success: false, error: error.message };
    }
}

// Get lead stats (admin)
export async function getLeadStats() {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*');

        if (error) throw error;

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const stats = {
            total: data.length,
            new: data.filter(l => l.status === 'new').length,
            contacted: data.filter(l => l.status === 'contacted').length,
            buyers: data.filter(l => l.source === 'website' || l.source === 'project-detail').length, // Approximation
            developers: data.filter(l => l.source === 'developer').length,
            thisWeek: data.filter(l => new Date(l.created_at) >= weekAgo).length,
        };

        return { success: true, data: stats };
    } catch (error) {
        console.error('Get lead stats error:', error);
        return { success: false, error: error.message };
    }
}

// Create new lead (public - from forms)
export async function createLead(data) {
    try {
        const { error } = await supabase
            .from('leads')
            .insert([{
                name: data.name,
                email: data.email || '',
                phone: data.phone,
                project_id: data.projectId || null,
                project_name: data.projectName || null,
                message: data.message || '',
                source: data.source || 'website',
                status: 'new',
            }]);

        if (error) {
            console.error('Create lead error:', error);
            return { success: false, error: 'Failed to submit enquiry. Please try again.' };
        }

        return {
            success: true,
            message: 'Thank you! We will contact you shortly.',
        };
    } catch (error) {
        console.error('Create lead error:', error);
        return { success: false, error: 'Failed to submit enquiry. Please try again.' };
    }
}

// Update lead status (admin)
export async function updateLeadStatus(id, status) {
    try {
        const { error } = await supabase
            .from('leads')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Update lead status error:', error);
        return { success: false, error: error.message };
    }
}

// Update lead notes/details (admin)
// Note: Notes field wasn't in my initial schema, ignoring for now or mapping to message
export async function updateLead(id, data) {
    try {
        const updateData = {};
        if (data.status) updateData.status = data.status;
        if (data.notes) updateData.message = data.notes; // Store notes in message for now or add notes column

        const { error } = await supabase
            .from('leads')
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Update lead error:', error);
        return { success: false, error: error.message };
    }
}

// Delete lead (admin)
export async function deleteLead(id) {
    try {
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete lead error:', error);
        return { success: false, error: error.message };
    }
}

// Submit contact form (public)
export async function submitContactForm(data) {
    try {
        // Use the 'leads' table for generalized contacts as well, or 'contacts' table if we created one.
        // I created a 'contacts' table in the schema.
        const { error } = await supabase
            .from('contacts')
            .insert([{
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                subject: data.enquiryType || 'General Enquiry',
                message: data.message,
            }]);

        if (error) {
            console.error('Contact form error:', error);
            return { success: false, error: 'Failed to send message. Please try again.' };
        }

        return {
            success: true,
            message: 'Thank you for your message! We will get back to you shortly.'
        };
    } catch (error) {
        console.error('Contact form error:', error);
        return { success: false, error: 'Failed to send message. Please try again.' };
    }
}

function transformLead(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        type: row.source === 'website' ? 'buyer' : row.source, // Map source to type for frontend compatibility
        projectName: row.project_name,
        message: row.message,
        source: row.source,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
