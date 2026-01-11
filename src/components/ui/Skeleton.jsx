/**
 * Skeleton Loader Components
 * For loading states across the app
 */
import './Skeleton.css';

export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-card__image"></div>
            <div className="skeleton-card__content">
                <div className="skeleton skeleton-card__title"></div>
                <div className="skeleton skeleton-card__text"></div>
                <div className="skeleton skeleton-card__text skeleton-card__text--short"></div>
            </div>
        </div>
    );
}

export function SkeletonText({ lines = 3, className = '' }) {
    return (
        <div className={`skeleton-text ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton skeleton-text__line"
                    style={{ width: i === lines - 1 ? '60%' : '100%' }}
                ></div>
            ))}
        </div>
    );
}

export function SkeletonCircle({ size = 'md', className = '' }) {
    return <div className={`skeleton skeleton-circle skeleton-circle--${size} ${className}`}></div>;
}

export function SkeletonButton({ className = '' }) {
    return <div className={`skeleton skeleton-button ${className}`}></div>;
}

export function SkeletonProjectCard() {
    return (
        <div className="skeleton-project-card">
            <div className="skeleton skeleton-project-card__image"></div>
            <div className="skeleton-project-card__content">
                <div className="skeleton skeleton-project-card__badge"></div>
                <div className="skeleton skeleton-project-card__title"></div>
                <div className="skeleton skeleton-project-card__location"></div>
                <div className="skeleton skeleton-project-card__price"></div>
            </div>
            <div className="skeleton-project-card__footer">
                <div className="skeleton skeleton-project-card__footer-text"></div>
            </div>
        </div>
    );
}

export function SkeletonBlogCard() {
    return (
        <div className="skeleton-blog-card">
            <div className="skeleton skeleton-blog-card__image"></div>
            <div className="skeleton-blog-card__content">
                <div className="skeleton skeleton-blog-card__category"></div>
                <div className="skeleton skeleton-blog-card__title"></div>
                <div className="skeleton skeleton-blog-card__text"></div>
                <div className="skeleton skeleton-blog-card__text skeleton-blog-card__text--short"></div>
                <div className="skeleton skeleton-blog-card__meta"></div>
            </div>
        </div>
    );
}

// Default export for convenience
export default {
    Card: SkeletonCard,
    Text: SkeletonText,
    Circle: SkeletonCircle,
    Button: SkeletonButton,
    ProjectCard: SkeletonProjectCard,
    BlogCard: SkeletonBlogCard,
};
