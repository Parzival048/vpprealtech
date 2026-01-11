/**
 * Google Analytics Integration
 * Tracks page views and custom events
 */

// Initialize GA4
export const initGA = (measurementId) => {
    if (!measurementId || typeof window === 'undefined') return;

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
        send_page_view: false, // We'll handle page views manually
    });
};

// Track page view
export const trackPageView = (url, title) => {
    if (typeof window.gtag === 'undefined') return;

    window.gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
    });
};

// Track custom events
export const trackEvent = (eventName, eventParams = {}) => {
    if (typeof window.gtag === 'undefined') return;

    window.gtag('event', eventName, eventParams);
};

// Common event trackers
export const analytics = {
    // Project events
    viewProject: (projectId, projectName) => {
        trackEvent('view_project', {
            project_id: projectId,
            project_name: projectName,
        });
    },

    // Lead generation
    submitLead: (leadType, source) => {
        trackEvent('generate_lead', {
            lead_type: leadType,
            source: source,
        });
    },

    // WhatsApp clicks
    clickWhatsApp: (context) => {
        trackEvent('click_whatsapp', {
            context: context,
        });
    },

    // Search
    search: (query, resultCount) => {
        trackEvent('search', {
            search_term: query,
            result_count: resultCount,
        });
    },

    // Filter usage
    useFilter: (filterType, filterValue) => {
        trackEvent('use_filter', {
            filter_type: filterType,
            filter_value: filterValue,
        });
    },

    // Social sharing
    share: (contentType, contentId, platform) => {
        trackEvent('share', {
            content_type: contentType,
            content_id: contentId,
            method: platform,
        });
    },

    // Contact form
    submitContact: (formType) => {
        trackEvent('submit_contact', {
            form_type: formType,
        });
    },

    // Blog engagement
    viewBlog: (blogId, blogTitle) => {
        trackEvent('view_blog', {
            blog_id: blogId,
            blog_title: blogTitle,
        });
    },

    // File downloads
    download: (fileName, fileType) => {
        trackEvent('file_download', {
            file_name: fileName,
            file_type: fileType,
        });
    },

    // Call tracking
    clickCall: (phoneNumber) => {
        trackEvent('click_call', {
            phone_number: phoneNumber,
        });
    },
};

export default analytics;
