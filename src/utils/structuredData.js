/**
 * JSON-LD Structured Data Generator
 * For SEO-rich snippets in search results
 */

// Generate Organization schema
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: 'VPP Realtech',
        description: 'Premium Real Estate Advisory in Pune',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        telephone: '+91-98765-43210',
        email: 'info@vpprealtech.com',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Pune',
            addressRegion: 'Maharashtra',
            postalCode: '411045',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '18.5204',
            longitude: '73.8567',
        },
        sameAs: [
            // Add your social media URLs here
            'https://facebook.com/vpprealtech',
            'https://instagram.com/vpprealtech',
            'https://linkedin.com/company/vpprealtech',
        ],
    };
}

// Generate Property listing schema
export function generatePropertySchema(project) {
    if (!project) return null;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return {
        '@context': 'https://schema.org',
        '@type': 'Residence',
        name: project.title,
        description: project.overview || project.title,
        url: `${baseUrl}/projects/${project.slug || project.id}`,
        address: {
            '@type': 'PostalAddress',
            addressLocality: project.location,
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
        },
        ...(project.priceRange && {
            offers: {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: project.priceRange,
                availability: 'https://schema.org/InStock',
            },
        }),
        ...(project.images && project.images.length > 0 && {
            image: project.images,
        }),
        ...(project.developer && {
            builder: {
                '@type': 'Organization',
                name: project.developer,
            },
        }),
        ...(project.amenities && {
            amenityFeature: project.amenities.map(amenity => ({
                '@type': 'LocationFeatureSpecification',
                name: amenity,
            })),
        }),
    };
}

// Generate Article schema for blog posts
export function generateArticleSchema(blog) {
    if (!blog) return null;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        description: blog.excerpt,
        image: blog.featuredImage,
        author: {
            '@type': 'Person',
            name: blog.author || 'VPP Realtech',
        },
        publisher: {
            '@type': 'Organization',
            name: 'VPP Realtech',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
            },
        },
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt || blog.createdAt,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/blogs/${blog.slug || blog.id}`,
        },
    };
}

// Generate BreadcrumbList schema
export function generateBreadcrumbSchema(items) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.path}`,
        })),
    };
}

// Helper to inject schema into page
export function injectStructuredData(schema) {
    if (typeof window === 'undefined' || !schema) return;

    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId);

    if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
}

// Helper to inject multiple schemas
export function injectMultipleSchemas(schemas) {
    if (typeof window === 'undefined' || !schemas || schemas.length === 0) return;

    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId);

    if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schemas);
}

export default {
    generateOrganizationSchema,
    generatePropertySchema,
    generateArticleSchema,
    generateBreadcrumbSchema,
    injectStructuredData,
    injectMultipleSchemas,
};
