/**
 * WhatsApp integration utility for VPP Realtech
 */

const WHATSAPP_NUMBER = '917507007875'; // Primary WhatsApp number

/**
 * Generate WhatsApp URL with pre-filled message
 * @param {Object} options - Message options
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppUrl(options = {}) {
    const {
        type = 'general',
        projectName = '',
        userType = 'buyer',
        source = 'website',
        formData = null,
    } = options;

    let message = '';

    switch (type) {
        case 'contact-form':
            if (formData) {
                message = `Hi VPP Realtech! 👋\\n\\n*Contact Form Submission*\\n\\n`;
                message += `*Name:* ${formData.name}\\n`;
                message += `*Phone:* ${formData.phone}\\n`;
                message += `*Email:* ${formData.email}\\n`;
                if (formData.enquiryType) {
                    message += `*Enquiry Type:* ${formData.enquiryType}\\n`;
                }
                if (formData.message) {
                    message += `\\n*Message:*\\n${formData.message}`;
                }
            } else {
                message = `Hi VPP Realtech! 👋\\n\\nI'd like to get in touch with you.`;
            }
            break;
        case 'project':
            message = `Hi VPP Realtech! 👋\\n\\nI'm interested in learning more about *${projectName}*.\\n\\nPlease share the details.\\n\\n[Source: ${source}]`;
            break;
        case 'buyer':
            message = `Hi VPP Realtech! 👋\\n\\nI'm looking to buy a property in Pune and would like your assistance.\\n\\nPlease help me find the right property.\\n\\n[Source: ${source}]`;
            break;
        case 'developer':
            message = `Hi VPP Realtech! 👋\\n\\nI'm a developer interested in discussing a mandate partnership.\\n\\nI'd like to schedule a strategy call.\\n\\n[Source: ${source}]`;
            break;
        case 'callback':
            message = `Hi VPP Realtech! 👋\\n\\nI'd like to request a callback to discuss my property requirements.\\n\\n[Source: ${source}]`;
            break;
        default:
            message = `Hi VPP Realtech! 👋\\n\\nI visited your website and would like to know more about your services.\\n\\n[Source: ${source}]`;
    }

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp in new tab
 * @param {Object} options - Message options
 */
export function openWhatsApp(options = {}) {
    const url = generateWhatsAppUrl(options);
    window.open(url, '_blank', 'noopener,noreferrer');
}

export default { generateWhatsAppUrl, openWhatsApp };
