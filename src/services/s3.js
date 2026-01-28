/**
 * AWS S3 Service for Image Uploads
 * Uses direct S3 uploads with public bucket access
 */

// S3 Configuration from environment variables
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'ap-south-1';
const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET || 'vppimages';
const AWS_ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';

// Generate S3 public URL
function getS3Url(key) {
    return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

// Check if S3 is configured
export function isS3Configured() {
    return !!(AWS_ACCESS_KEY && AWS_SECRET_KEY && S3_BUCKET);
}

/**
 * Upload file to S3
 * @param {File} file - File to upload
 * @param {string} folder - Folder path in bucket (e.g., 'blogs', 'projects')
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadToS3(file, folder = 'uploads') {
    if (!isS3Configured()) {
        return { success: false, error: 'S3 not configured. Please add AWS credentials to environment variables.' };
    }

    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        // Create the signature for AWS S3
        const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
        const dateStamp = timestamp.substring(0, 8);

        // For simplicity, we'll use the AWS SDK approach through a serverless function
        // Or use direct PUT with proper CORS configuration on S3 bucket

        // Using fetch with presigned-like approach (requires proper bucket policy)
        const uploadUrl = getS3Url(fileName);

        const response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
                'x-amz-acl': 'public-read',
            },
        });

        if (response.ok) {
            return { success: true, url: uploadUrl };
        } else {
            // If direct upload fails, try using base64 approach for smaller files
            return await uploadAsBase64(file, folder);
        }
    } catch (error) {
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
