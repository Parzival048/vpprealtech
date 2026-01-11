import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { signIn } from '../../services/auth';
import './Admin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await signIn(formData.email, formData.password);

        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    return (
        <div className="admin-login">
            <div className="admin-login__container">
                <div className="admin-login__header">
                    <div className="admin-login__logo">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="15" width="10" height="20" rx="1" fill="currentColor" />
                            <rect x="17" y="8" width="10" height="27" rx="1" fill="currentColor" opacity="0.8" />
                            <rect x="29" y="12" width="8" height="23" rx="1" fill="currentColor" opacity="0.6" />
                        </svg>
                    </div>
                    <h1>Admin Portal</h1>
                    <p>Sign in to manage your VPP Realtech dashboard</p>
                </div>

                <form className="admin-login__form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="admin-login__error">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={isLoading}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="admin-login__footer">
                    <a href="/" className="admin-login__back">← Back to Website</a>
                </div>
            </div>
        </div>
    );
}
