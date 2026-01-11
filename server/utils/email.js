import nodemailer from 'nodemailer';

// Create transporter
let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
}

// Send email
export async function sendEmail({ to, subject, html, text }) {
    try {
        // Skip if SMTP is not configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('📧 Email would be sent (SMTP not configured):');
            console.log(`  To: ${to}`);
            console.log(`  Subject: ${subject}`);
            return { success: true, info: 'Email skipped (SMTP not configured)' };
        }

        const mailTransporter = getTransporter();

        const info = await mailTransporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
            text,
        });

        console.log('Email sent:', info.messageId);
        return { success: true, info };
    } catch (error) {
        console.error('Email error:', error.message);
        return { success: false, error: error.message };
    }
}

// Email templates
export function getBuyerEnquiryEmail({ name, email, phone, budget, propertyType, location, message, projectName }) {
    return {
        subject: `New Buyer Enquiry${projectName ? ` - ${projectName}` : ''}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; text-align: center;">
          <h1 style="color: #FF6B35; margin: 0;">VPP Realtech</h1>
          <p style="color: #fff; margin: 10px 0 0;">New Buyer Enquiry Received</p>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #FF6B35; padding-bottom: 10px;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666;">Name:</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
            ${projectName ? `<tr><td style="padding: 8px 0; color: #666;">Interested In:</td><td style="padding: 8px 0;"><strong>${projectName}</strong></td></tr>` : ''}
            ${budget ? `<tr><td style="padding: 8px 0; color: #666;">Budget:</td><td style="padding: 8px 0;">${budget}</td></tr>` : ''}
            ${propertyType ? `<tr><td style="padding: 8px 0; color: #666;">Property Type:</td><td style="padding: 8px 0;">${propertyType}</td></tr>` : ''}
            ${location ? `<tr><td style="padding: 8px 0; color: #666;">Preferred Location:</td><td style="padding: 8px 0;">${location}</td></tr>` : ''}
          </table>
          ${message ? `
          <h3 style="color: #1a1a2e; margin-top: 20px;">Message</h3>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
          ` : ''}
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>This is an automated email from VPP Realtech website.</p>
        </div>
      </div>
    `,
        text: `New Buyer Enquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n${projectName ? `Interested In: ${projectName}\n` : ''}${budget ? `Budget: ${budget}\n` : ''}${message ? `Message: ${message}` : ''}`,
    };
}

export function getDeveloperEnquiryEmail({ name, company, email, phone, projectName, projectLocation, message }) {
    return {
        subject: `New Developer Mandate Enquiry - ${company || name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; text-align: center;">
          <h1 style="color: #FF6B35; margin: 0;">VPP Realtech</h1>
          <p style="color: #fff; margin: 10px 0 0;">New Developer Partnership Enquiry</p>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #FF6B35; padding-bottom: 10px;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666;">Name:</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
            ${company ? `<tr><td style="padding: 8px 0; color: #666;">Company:</td><td style="padding: 8px 0;"><strong>${company}</strong></td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
            ${projectName ? `<tr><td style="padding: 8px 0; color: #666;">Project Name:</td><td style="padding: 8px 0;">${projectName}</td></tr>` : ''}
            ${projectLocation ? `<tr><td style="padding: 8px 0; color: #666;">Project Location:</td><td style="padding: 8px 0;">${projectLocation}</td></tr>` : ''}
          </table>
          ${message ? `
          <h3 style="color: #1a1a2e; margin-top: 20px;">Message</h3>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
          ` : ''}
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>This is an automated email from VPP Realtech website.</p>
        </div>
      </div>
    `,
        text: `New Developer Mandate Enquiry\n\nName: ${name}\n${company ? `Company: ${company}\n` : ''}Email: ${email}\nPhone: ${phone}\n${projectName ? `Project: ${projectName}\n` : ''}${projectLocation ? `Location: ${projectLocation}\n` : ''}${message ? `Message: ${message}` : ''}`,
    };
}

export function getConfirmationEmail({ name, type }) {
    const isBuyer = type === 'buyer';
    return {
        subject: 'Thank you for contacting VPP Realtech',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; text-align: center;">
          <h1 style="color: #FF6B35; margin: 0;">VPP Realtech</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #1a1a2e;">Thank you, ${name}!</h2>
          <p style="color: #444; line-height: 1.8;">
            We have received your ${isBuyer ? 'property enquiry' : 'partnership enquiry'} and our team will get back to you within 24 hours.
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
        text: `Thank you, ${name}!\n\nWe have received your ${isBuyer ? 'property enquiry' : 'partnership enquiry'} and our team will get back to you within 24 hours.\n\nBest regards,\nVPP Realtech Team`,
    };
}
