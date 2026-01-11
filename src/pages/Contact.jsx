import { useState } from 'react';
import Button, { WhatsAppButton } from '../components/ui/Button';
import Input, { Textarea, Select } from '../components/ui/Input';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { openWhatsApp } from '../utils/whatsapp';
import { submitContactForm } from '../services/leads';
import './Contact.css';

const enquiryTypeOptions = [
    { value: 'buyer', label: 'Property Buying Enquiry' },
    { value: 'developer', label: 'Developer Partnership' },
    { value: 'general', label: 'General Inquiry' },
];

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        enquiryType: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const [headerRef, headerVisible] = useScrollReveal();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        const result = await submitContactForm(formData);

        if (result.success) {
            setSubmitStatus({ type: 'success', message: result.message });
            setFormData({
                name: '',
                phone: '',
                email: '',
                enquiryType: '',
                message: '',
            });
        } else {
            setSubmitStatus({ type: 'error', message: result.error });
        }

        setIsSubmitting(false);
    };

    return (
        <main className="contact-page">
            {/* Header */}
            <section className="contact-header" ref={headerRef}>
                <div className="contact-header__bg"></div>
                <div className="container">
                    <div className={`contact-header__content ${headerVisible ? 'visible' : ''}`}>
                        <span className="contact-header__eyebrow">Get in Touch</span>
                        <h1 className="contact-header__title">Contact Us</h1>
                        <p className="contact-header__subtitle">
                            Have questions or ready to start your real estate journey? We'd love to hear from you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="contact-content">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div className="contact-info">
                            <div className="contact-info__card">
                                <div className="contact-info__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Visit Us</h3>
                                    <p>VPP Realtech Offices,<br />Baner Road, Pune 411045<br />Maharashtra, India</p>
                                </div>
                            </div>

                            <div className="contact-info__card">
                                <div className="contact-info__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Call Us</h3>
                                    <p><a href="tel:+919876543210">+91 98765 43210</a></p>
                                    <p><a href="tel:+912012345678">+91 20 1234 5678</a></p>
                                </div>
                            </div>

                            <div className="contact-info__card">
                                <div className="contact-info__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Email Us</h3>
                                    <p><a href="mailto:info@vpprealtech.com">info@vpprealtech.com</a></p>
                                    <p><a href="mailto:sales@vpprealtech.com">sales@vpprealtech.com</a></p>
                                </div>
                            </div>

                            <div className="contact-info__card">
                                <div className="contact-info__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Business Hours</h3>
                                    <p>Monday - Saturday<br />10:00 AM - 7:00 PM</p>
                                </div>
                            </div>

                            <div className="contact-whatsapp">
                                <p>Prefer instant messaging?</p>
                                <WhatsAppButton
                                    onClick={() => openWhatsApp({ type: 'general', source: 'contact-page' })}
                                >
                                    Chat on WhatsApp
                                </WhatsAppButton>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <h2>Send Us a Message</h2>

                                {submitStatus && (
                                    <div className={`contact-form__status contact-form__status--${submitStatus.type}`}>
                                        {submitStatus.message}
                                    </div>
                                )}

                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="contact-form__row">
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Select
                                    label="Enquiry Type"
                                    name="enquiryType"
                                    value={formData.enquiryType}
                                    onChange={handleChange}
                                    options={enquiryTypeOptions}
                                    required
                                />
                                <Textarea
                                    label="Your Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    rows={5}
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={isSubmitting}
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="contact-map">
                <div className="contact-map__placeholder">
                    <span>Interactive Map - Google Maps Integration</span>
                </div>
            </section>
        </main>
    );
}
