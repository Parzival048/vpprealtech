/**
 * Supabase Service for Projects
 */
import { supabase } from './supabase';

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Get all published projects (public)
export async function getProjects(filters = {}) {
    try {
        let query = supabase
            .from('projects')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters.location) {
            query = query.ilike('location', filters.location);
        }
        if (filters.type) {
            query = query.ilike('type', filters.type);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.budget) {
            query = query.eq('budget_category', filters.budget);
        }
        if (filters.featured) {
            query = query.eq('featured', true);
        }
        if (filters.limit) {
            query = query.limit(parseInt(filters.limit));
        }

        const { data, error } = await query;

        if (error) {
            console.error('Get projects error:', error);
            return { success: false, error: error.message, data: [] };
        }

        // Transform snake_case to camelCase
        const projects = (data || []).map(transformProject);
        return { success: true, data: projects };
    } catch (error) {
        console.error('Get projects error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get all projects including drafts (admin)
export async function getAllProjects() {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get all projects error:', error);
            return { success: false, error: error.message, data: [] };
        }

        const projects = (data || []).map(transformProject);
        return { success: true, data: projects };
    } catch (error) {
        console.error('Get all projects error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get featured projects
export async function getFeaturedProjects() {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('published', true)
            .eq('featured', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get featured projects error:', error);
            return { success: false, error: error.message, data: [] };
        }

        const projects = (data || []).map(transformProject);
        return { success: true, data: projects };
    } catch (error) {
        console.error('Get featured projects error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get single project by slug
export async function getProjectBySlug(slug) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error) {
            console.error('Get project error:', error);
            return { success: false, error: 'Project not found' };
        }

        return { success: true, data: transformProject(data) };
    } catch (error) {
        console.error('Get project error:', error);
        return { success: false, error: error.message };
    }
}

// Create new project (admin)
export async function createProject(projectData) {
    try {
        const slug = generateSlug(projectData.title);

        const { data, error } = await supabase
            .from('projects')
            .insert([{
                slug,
                title: projectData.title,
                location: projectData.location,
                address: projectData.address || '',
                type: projectData.type,
                status: projectData.status,
                price_range: projectData.priceRange || '',
                developer: projectData.developer || '',
                rera_id: projectData.reraId || '',
                possession: projectData.possession || '',
                configurations: projectData.configurations || [],
                sizes: projectData.sizes || '',
                amenities: projectData.amenities || [],
                overview: projectData.overview || '',
                highlights: projectData.highlights || [],
                images: projectData.images || [],
                video_url: projectData.videoUrl || '',
                budget_category: projectData.budgetCategory || '',
                published: projectData.published || false,
                featured: projectData.featured || false,
            }])
            .select()
            .single();

        if (error) {
            console.error('Create project error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: transformProject(data) };
    } catch (error) {
        console.error('Create project error:', error);
        return { success: false, error: error.message };
    }
}

// Update project (admin)
export async function updateProject(id, projectData) {
    try {
        const { error } = await supabase
            .from('projects')
            .update({
                title: projectData.title,
                location: projectData.location,
                address: projectData.address,
                type: projectData.type,
                status: projectData.status,
                price_range: projectData.priceRange,
                developer: projectData.developer,
                rera_id: projectData.reraId,
                possession: projectData.possession,
                configurations: projectData.configurations,
                sizes: projectData.sizes,
                amenities: projectData.amenities,
                overview: projectData.overview,
                highlights: projectData.highlights,
                images: projectData.images,
                video_url: projectData.videoUrl,
                budget_category: projectData.budgetCategory,
                published: projectData.published,
                featured: projectData.featured,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Update project error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Update project error:', error);
        return { success: false, error: error.message };
    }
}

// Toggle project publish status (admin)
export async function toggleProjectPublish(id) {
    try {
        // First get current status
        const { data: project, error: fetchError } = await supabase
            .from('projects')
            .select('published')
            .eq('id', id)
            .single();

        if (fetchError) {
            return { success: false, error: 'Project not found' };
        }

        // Toggle it
        const { error } = await supabase
            .from('projects')
            .update({ published: !project.published, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Toggle publish error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, published: !project.published };
    } catch (error) {
        console.error('Toggle publish error:', error);
        return { success: false, error: error.message };
    }
}

// Delete project (admin)
export async function deleteProject(id) {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete project error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete project error:', error);
        return { success: false, error: error.message };
    }
}

// Transform database row to frontend format (snake_case to camelCase)
function transformProject(row) {
    if (!row) return null;
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        location: row.location,
        address: row.address,
        type: row.type,
        status: row.status,
        priceRange: row.price_range,
        developer: row.developer,
        reraId: row.rera_id,
        possession: row.possession,
        configurations: row.configurations || [],
        sizes: row.sizes,
        amenities: row.amenities || [],
        overview: row.overview,
        highlights: row.highlights || [],
        images: row.images || [],
        videoUrl: row.video_url,
        budgetCategory: row.budget_category,
        published: row.published,
        featured: row.featured,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
