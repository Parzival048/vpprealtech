import { useState } from 'react';
import './VideoInput.css';

/**
 * Component for YouTube video URL input with embed preview
 */
export default function VideoInput({ value, onChange }) {
    const [error, setError] = useState(null);

    const extractYouTubeId = (url) => {
        if (!url) return null;

        // Match various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const handleChange = (e) => {
        const url = e.target.value;
        setError(null);

        if (url && !extractYouTubeId(url)) {
            setError('Please enter a valid YouTube URL');
        }

        onChange(url);
    };

    const videoId = extractYouTubeId(value);

    return (
        <div className="video-input">
            <label className="video-input__label">
                Video URL (YouTube)
            </label>

            <input
                type="url"
                value={value || ''}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`video-input__field ${error ? 'video-input__field--error' : ''}`}
            />

            {error && (
                <div className="video-input__error">{error}</div>
            )}

            {videoId && (
                <div className="video-input__preview">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}

            <p className="video-input__hint">
                Paste a YouTube video URL to embed a project walkthrough or tour
            </p>
        </div>
    );
}
