/**
 * Lazy Loading Image Component
 * With placeholder and smooth fade-in
 */
import { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

export default function LazyImage({
    src,
    alt,
    className = '',
    width,
    height,
    aspectRatio,
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before image comes into view
            }
        );

        observer.observe(imgRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const containerStyle = {
        aspectRatio: aspectRatio || (width && height ? `${width} / ${height}` : undefined),
    };

    return (
        <div
            ref={imgRef}
            className={`lazy-image ${isLoaded ? 'lazy-image--loaded' : ''} ${className}`}
            style={containerStyle}
        >
            {/* Placeholder */}
            {!isLoaded && (
                <div className="lazy-image__placeholder">
                    <div className="lazy-image__shimmer"></div>
                </div>
            )}

            {/* Actual Image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    onLoad={handleLoad}
                    className="lazy-image__img"
                    loading="lazy"
                    {...props}
                />
            )}
        </div>
    );
}
