import { Router } from 'express';
import { sendEmail, getBuyerEnquiryEmail, getDeveloperEnquiryEmail, getConfirmationEmail } from '../utils/email.js';

const router = Router();

// POST /api/contact - Contact form submission (public)
router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            enquiryType,
            message,
        } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required',
            });
        }

        // Send email to admin
        const adminEmail = {
            subject: `New Contact Form Submission - ${enquiryType || 'General'}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; text-align: center;">
            <h1 style="color: #FF6B35; margin: 0;">VPP Realtech</h1>
            <p style="color: #fff; margin: 10px 0 0;">Contact Form Submission</p>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #1a1a2e; border-bottom: 2px solid #FF6B35; padding-bottom: 10px;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666;">Name:</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>` : ''}
              ${enquiryType ? `<tr><td style="padding: 8px 0; color: #666;">Enquiry Type:</td><td style="padding: 8px 0;">${enquiryType}</td></tr>` : ''}
            </table>
            <h3 style="color: #1a1a2e; margin-top: 20px;">Message</h3>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
          </div>
          <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated email from VPP Realtech website.</p>
          </div>
        </div>
      `,
            text: `Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${enquiryType ? `Type: ${enquiryType}\n` : ''}\nMessage: ${message}`,
        };

        sendEmail({ to: process.env.ADMIN_EMAIL, ...adminEmail });

        // Send confirmation to user
        const confirmEmail = {
            subject: 'Thank you for contacting VPP Realtech',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; text-align: center;">
            <h1 style="color: #FF6B35; margin: 0;">VPP Realtech</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #1a1a2e;">Thank you, ${name}!</h2>
            <p style="color: #444; line-height: 1.8;">
              We have received your message and our team will get back to you within 24 hours.
            </p>
            <p style="color: #444; line-height: 1.8;">
              In the meantime, feel free to reach us on WhatsApp for instant assistance:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://wa.me/${process.env.WHATSAPP_NUMBER}" style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Chat on WhatsApp
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Best regards,<br/>
              <strong>VPP Realtech Team</strong>
            </p>
          </div>
          <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>VPP Realtech | Baner Road, Pune 411045</p>
          </div>
        </div>
      `,
            text: `Thank you, ${name}!\n\nWe have received your message and our team will get back to you within 24 hours.\n\nBest regards,\nVPP Realtech Team`,
        };

        sendEmail({ to: email, ...confirmEmail });

        res.json({
            success: true,
            message: 'Thank you for your message! We will get back to you shortly.',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message',
        });
    }
});

export default router;
