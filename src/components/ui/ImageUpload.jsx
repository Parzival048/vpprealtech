/**
 * Image Upload Component using Supabase Storage
 */
import { useState } from 'react';
import { supabase } from '../../services/supabase';
import './ImageUpload.css';

export default function ImageUpload({ images = [], onImagesChange, onChange, maxImages = 10, folder = 'projects' }) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);

    // Support both onChange and onImagesChange props
    const handleImagesUpdate = (newImages) => {
        if (onImagesChange) {
            onImagesChange(newImages);
        } else if (onChange) {
            onChange(newImages);
        }
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        await uploadFiles(files);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        await uploadFiles(files);
    };

    const uploadFiles = async (files) => {
        if (files.length === 0) return;
        if (images.length + files.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        const newImages = [...images];
        const totalFiles = files.length;
        let completed = 0;

        for (const file of files) {
            try {
                // Create unique filename
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
                const filePath = `${folder}/${fileName}`;

                // Upload to Supabase Storage
                const { data, error } = await supabase.storage
                    .from('images')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (error) {
                    console.error('Upload error:', error);
                    continue;
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                if (urlData?.publicUrl) {
                    newImages.push(urlData.publicUrl);
                }

                completed++;
                setUploadProgress(Math.round((completed / totalFiles) * 100));
            } catch (error) {
                console.error('Upload error:', error);
            }
        }

        setUploading(false);
        setUploadProgress(0);
        handleImagesUpdate(newImages);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        handleImagesUpdate(newImages);
    };

    const moveImage = (index, direction) => {
        const newImages = [...images];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newImages.length) return;
        [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
        handleImagesUpdate(newImages);
    };

    return (
        <div className="image-upload">
            {/* Drop Zone */}
            <div
                className={`image-upload__dropzone ${dragOver ? 'image-upload__dropzone--active' : ''} ${uploading ? 'image-upload__dropzone--uploading' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="image-upload__input"
                    id="image-upload-input"
                />
                <label htmlFor="image-upload-input" className="image-upload__label">
                    {uploading ? (
                        <>
                            <div className="image-upload__progress">
                                <div
                                    className="image-upload__progress-bar"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <span>Uploading... {uploadProgress}%</span>
                        </>
                    ) : (
                        <>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Drop images here or click to upload</span>
                            <small>Maximum {maxImages} images, JPG/PNG/WebP</small>
                        </>
                    )}
                </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="image-upload__previews">
                    {images.map((url, index) => (
                        <div key={url} className="image-upload__preview">
                            <img src={url} alt={`Upload ${index + 1}`} />
                            <div className="image-upload__preview-actions">
                                {index > 0 && (
                                    <button type="button" onClick={() => moveImage(index, -1)} title="Move left">
                                        ←
                                    </button>
                                )}
                                {index < images.length - 1 && (
                                    <button type="button" onClick={() => moveImage(index, 1)} title="Move right">
                                        →
                                    </button>
                                )}
                                <button type="button" onClick={() => removeImage(index)} className="image-upload__remove" title="Remove">
                                    ×
                                </button>
                            </div>
                            {index === 0 && <span className="image-upload__primary">Primary</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
