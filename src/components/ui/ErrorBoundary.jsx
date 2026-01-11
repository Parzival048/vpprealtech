/**
 * Error Boundary Component
 * Catches React errors and shows friendly fallback UI
 */
import { Component } from 'react';
import Button from './Button';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Log error to analytics or error reporting service
        console.error('Error caught by boundary:', error, errorInfo);

        // You can integrate with error tracking services here
        // Example: Sentry.captureException(error);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary__content">
                        <div className="error-boundary__icon">⚠️</div>
                        <h1 className="error-boundary__title">Oops! Something went wrong</h1>
                        <p className="error-boundary__message">
                            We're sorry for the inconvenience. The page encountered an unexpected error.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-boundary__details">
                                <summary>Error Details (Development Only)</summary>
                                <pre className="error-boundary__stack">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="error-boundary__actions">
                            <Button variant="primary" size="lg" onClick={this.handleReset}>
                                Go to Homepage
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </Button>
                        </div>

                        <p className="error-boundary__help">
                            If the problem persists, please{' '}
                            <a href="/contact" className="error-boundary__link">contact support</a>
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
