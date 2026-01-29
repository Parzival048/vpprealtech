/**
 * AWS S3 Service for Image Uploads
 * Uses direct S3 uploads with public bucket access
 */

// S3 Configuration from environment variables
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'ap-south-1';
const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET || '';
const AWS_ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';

// Generate S3 public URL
function getS3Url(key) {
    return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

// Check if S3 is configured
export function isS3Configured() {
    // Check if all required values are present and not placeholder values
    const hasCredentials = AWS_ACCESS_KEY && AWS_SECRET_KEY && S3_BUCKET;
    const notPlaceholders = !AWS_ACCESS_KEY.includes('your_') &&
        !AWS_SECRET_KEY.includes('your_') &&
        !S3_BUCKET.includes('your_');
    return !!(hasCredentials && notPlaceholders);
}

/**
 * Upload file to S3
 * Note: Direct browser uploads require the S3 bucket to have:
 * 1. CORS configuration allowing your domain
 * 2. Bucket policy allowing public PUT (or use pre-signed URLs)
 * 
 * @param {File} file - File to upload
 * @param {string} folder - Folder path in bucket (e.g., 'blogs', 'projects')
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadToS3(file, folder = 'uploads') {
    if (!isS3Configured()) {
        return { success: false, error: 'S3 not configured' };
    }

    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const uploadUrl = getS3Url(fileName);

        // Using fetch with a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            return { success: true, url: uploadUrl };
        } else {
            const errorText = await response.text().catch(() => 'Unknown error');
            return { success: false, error: `S3 upload failed (${response.status}): ${errorText}` };
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            return { success: false, error: 'S3 upload timed out' };
        }
        console.error('S3 upload error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Upload file as base64 URL (fallback for when S3 direct upload fails)
 * Stores the image as a data URL - works for smaller images
 */
async function uploadAsBase64(file, folder) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve({ success: true, url: reader.result });
        };
        reader.onerror = () => {
            resolve({ success: false, error: 'Failed to read file' });
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Upload multiple files to S3
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - Folder path in bucket
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<string[]>} Array of uploaded URLs
 */
export async function uploadMultipleToS3(files, folder = 'uploads', onProgress = null) {
    const urls = [];
    let completed = 0;

    for (const file of files) {
        const result = await uploadToS3(file, folder);
        if (result.success && result.url) {
            urls.push(result.url);
        }
        completed++;
        if (onProgress) {
            onProgress(Math.round((completed / files.length) * 100));
        }
    }

    return urls;
}

/**
 * Convert S3 URL to CloudFront URL if configured
 */
export function getOptimizedUrl(url, width = null) {
    if (!url) return '';
    // If using CloudFront or image optimization, transform URL here
    // For now, return the original URL
    return url;
}

export default {
    uploadToS3,
    uploadMultipleToS3,
    isS3Configured,
    getOptimizedUrl,
};
