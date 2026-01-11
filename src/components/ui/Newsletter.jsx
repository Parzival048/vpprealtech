/**
 * Newsletter Signup Component
 * Email subscription with validation
 */
import { useState } from 'react';
import Button from './Button';
import { useToast } from './Toast';
import './Newsletter.css';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            // Here you would call your newsletter API
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Successfully subscribed to newsletter!');
            setEmail('');
        } catch (error) {
            toast.error('Failed to subscribe. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="newsletter">
            <div className="newsletter__content">
                <h3 className="newsletter__title">Stay Updated</h3>
                <p className="newsletter__description">
                    Get the latest property listings and real estate insights delivered to your inbox.
                </p>
            </div>

            <form className="newsletter__form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="newsletter__input"
                    disabled={isSubmitting}
                />
                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    className="newsletter__button"
                >
                    Subscribe
                </Button>
            </form>

            <p className="newsletter__privacy">
                We respect your privacy. Unsubscribe at any time.
            </p>
        </div>
    );
}
