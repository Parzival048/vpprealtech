/**
 * Supabase Service for Blogs
 */
import { supabase } from './supabase';

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Calculate reading time
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content ? content.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Get all published blogs (public)
export async function getBlogs() {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get blogs error:', error);
            return { success: false, error: error.message, data: [] };
        }

        const blogs = (data || []).map(transformBlog);
        return { success: true, data: blogs };
    } catch (error) {
        console.error('Get blogs error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get all blogs including drafts (admin)
export async function getAllBlogs() {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get all blogs error:', error);
            return { success: false, error: error.message, data: [] };
        }

        const blogs = (data || []).map(transformBlog);
        return { success: true, data: blogs };
    } catch (error) {
        console.error('Get all blogs error:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Get single blog by slug
export async function getBlogBySlug(slug) {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error) {
            console.error('Get blog error:', error);
            return { success: false, error: 'Blog not found' };
        }

        return { success: true, data: transformBlog(data) };
    } catch (error) {
        console.error('Get blog error:', error);
        return { success: false, error: error.message };
    }
}

// Create new blog (admin)
export async function createBlog(blogData) {
    try {
        const slug = generateSlug(blogData.title);
        const readingTime = calculateReadingTime(blogData.content);

        const { data, error } = await supabase
            .from('blogs')
            .insert([{
                slug,
                title: blogData.title,
                excerpt: blogData.excerpt || '',
                content: blogData.content || '',
                category: blogData.category || '',
                author: blogData.author || 'VPP Realtech',
                featured_image: blogData.featuredImage || '',
                gallery_images: blogData.galleryImages || [],
                source_link: blogData.sourceLink || '',
                reading_time: readingTime,
                published: blogData.published || false,
            }])
            .select()
            .single();

        if (error) {
            console.error('Create blog error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: transformBlog(data) };
    } catch (error) {
        console.error('Create blog error:', error);
        return { success: false, error: error.message };
    }
}

// Update blog (admin)
export async function updateBlog(id, blogData) {
    try {
        const readingTime = calculateReadingTime(blogData.content);

        const { error } = await supabase
            .from('blogs')
            .update({
                title: blogData.title,
                excerpt: blogData.excerpt,
                content: blogData.content,
                category: blogData.category,
                author: blogData.author,
                featured_image: blogData.featuredImage,
                gallery_images: blogData.galleryImages || [],
                source_link: blogData.sourceLink || '',
                reading_time: readingTime,
                published: blogData.published,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Update blog error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Update blog error:', error);
        return { success: false, error: error.message };
    }
}

// Toggle blog publish status (admin)
export async function toggleBlogPublish(id) {
    try {
        const { data: blog, error: fetchError } = await supabase
            .from('blogs')
            .select('published')
            .eq('id', id)
            .single();

        if (fetchError) {
            return { success: false, error: 'Blog not found' };
        }

        const { error } = await supabase
            .from('blogs')
            .update({ published: !blog.published, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Toggle publish error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, published: !blog.published };
    } catch (error) {
        console.error('Toggle publish error:', error);
        return { success: false, error: error.message };
    }
}

// Delete blog (admin)
export async function deleteBlog(id) {
    try {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete blog error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete blog error:', error);
        return { success: false, error: error.message };
    }
}

// Get blog stats (admin)
export async function getBlogStats() {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('id, published');

        if (error) {
            return { total: 0, published: 0, drafts: 0 };
        }

        const total = data.length;
        const published = data.filter(b => b.published).length;
        const drafts = total - published;

        return { total, published, drafts };
    } catch (error) {
        return { total: 0, published: 0, drafts: 0 };
    }
}

// Transform database row to frontend format
function transformBlog(row) {
    if (!row) return null;
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        category: row.category,
        author: row.author,
        featuredImage: row.featured_image,
        galleryImages: row.gallery_images || [],
        sourceLink: row.source_link || '',
        readingTime: row.reading_time,
        published: row.published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
