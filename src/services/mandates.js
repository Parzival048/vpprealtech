/**
 * Supabase Service for Mandates
 */
import { supabase } from './supabase';

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Get all published mandates (public)
export async function getMandates(filters = {}) {
    try {
        let query = supabase
            .from('mandates')
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
        if (filters.featured) {
            query = query.eq('featured', true);
        }
        if (filters.limit) {
            query = query.limit(parseInt(filters.limit));
        }

        const { data, error } = await query;

        if (error) {
            console.error('Get mandates error:', error);
            return { success: false, error: error.message, data: [] };
        }

        const mandates = (data || []).map(transformMandate);
        return { success: true, data: mandates };
    } catch (error) {
        console.error('Get mandates error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get all mandates including drafts (admin)
export async function getAllMandates() {
    try {
        const { data, error } = await supabase
            .from('mandates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get all mandates error:', error);
            return { success: false, error: error.message, data: [] };
        }

        const mandates = (data || []).map(transformMandate);
        return { success: true, data: mandates };
    } catch (error) {
        console.error('Get all mandates error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get featured mandates
export async function getFeaturedMandates() {
    try {
        const { data, error } = await supabase
            .from('mandates')
            .select('*')
            .eq('published', true)
            .eq('featured', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get featured mandates error:', error);
            return { success: false, error: error.message, data: [] };
        }

        const mandates = (data || []).map(transformMandate);
        return { success: true, data: mandates };
    } catch (error) {
        console.error('Get featured mandates error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get single mandate by slug
export async function getMandateBySlug(slug) {
    try {
        const { data, error } = await supabase
            .from('mandates')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error) {
            console.error('Get mandate error:', error);
            return { success: false, error: 'Mandate not found' };
        }

        return { success: true, data: transformMandate(data) };
    } catch (error) {
        console.error('Get mandate error:', error);
        return { success: false, error: error.message };
    }
}

// Create new mandate (admin)
export async function createMandate(mandateData) {
    try {
        const slug = generateSlug(mandateData.title);

        const { data, error } = await supabase
            .from('mandates')
            .insert([{
                slug,
                title: mandateData.title,
                developer: mandateData.developer || '',
                location: mandateData.location,
                address: mandateData.address || '',
                type: mandateData.type,
                status: mandateData.status,
                price_range: mandateData.priceRange || '',
                rera_id: mandateData.reraId || '',
                possession: mandateData.possession || '',
                configurations: mandateData.configurations || [],
                sizes: mandateData.sizes || '',
                amenities: mandateData.amenities || [],
                overview: mandateData.overview || '',
                highlights: mandateData.highlights || [],
                images: mandateData.images || [],
                video_url: mandateData.videoUrl || '',
                partnership_type: mandateData.partnershipType || '',
                published: mandateData.published || false,
                featured: mandateData.featured || false,
            }])
            .select()
            .single();

        if (error) {
            console.error('Create mandate error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: transformMandate(data) };
    } catch (error) {
        console.error('Create mandate error:', error);
        return { success: false, error: error.message };
    }
}

// Update mandate (admin)
export async function updateMandate(id, mandateData) {
    try {
        const { error } = await supabase
            .from('mandates')
            .update({
                title: mandateData.title,
                developer: mandateData.developer,
                location: mandateData.location,
                address: mandateData.address,
                type: mandateData.type,
                status: mandateData.status,
                price_range: mandateData.priceRange,
                rera_id: mandateData.reraId,
                possession: mandateData.possession,
                configurations: mandateData.configurations,
                sizes: mandateData.sizes,
                amenities: mandateData.amenities,
                overview: mandateData.overview,
                highlights: mandateData.highlights,
                images: mandateData.images,
                video_url: mandateData.videoUrl,
                partnership_type: mandateData.partnershipType,
                published: mandateData.published,
                featured: mandateData.featured,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Update mandate error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Update mandate error:', error);
        return { success: false, error: error.message };
    }
}

// Toggle mandate publish status (admin)
export async function toggleMandatePublish(id) {
    try {
        const { data: mandate, error: fetchError } = await supabase
            .from('mandates')
            .select('published')
            .eq('id', id)
            .single();

        if (fetchError) {
            return { success: false, error: 'Mandate not found' };
        }

        const { error } = await supabase
            .from('mandates')
            .update({ published: !mandate.published, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Toggle publish error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, published: !mandate.published };
    } catch (error) {
        console.error('Toggle publish error:', error);
        return { success: false, error: error.message };
    }
}

// Delete mandate (admin)
export async function deleteMandate(id) {
    try {
        const { error } = await supabase
            .from('mandates')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete mandate error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete mandate error:', error);
        return { success: false, error: error.message };
    }
}

// Transform database row to frontend format
function transformMandate(row) {
    if (!row) return null;
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        developer: row.developer,
        location: row.location,
        address: row.address,
        type: row.type,
        status: row.status,
        priceRange: row.price_range,
        reraId: row.rera_id,
        possession: row.possession,
        configurations: row.configurations || [],
        sizes: row.sizes,
        amenities: row.amenities || [],
        overview: row.overview,
        highlights: row.highlights || [],
        images: row.images || [],
        videoUrl: row.video_url,
        partnershipType: row.partnership_type,
        published: row.published,
        featured: row.featured,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
