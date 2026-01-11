/**
 * Lead Scoring Utility
 * Calculates lead quality scores based on multiple factors
 */

export function calculateLeadScore(lead) {
    let score = 0;
    const weights = {
        hasEmail: 10,
        hasPhone: 10,
        hasMessage: 5,
        projectInterest: 15,
        budgetRange: 20,
        timeframe: 10,
        source: 15,
        engagement: 15,
    };

    // Email validation
    if (lead.email && lead.email.includes('@')) {
        score += weights.hasEmail;
    }

    // Phone validation
    if (lead.phone && lead.phone.length >= 10) {
        score += weights.hasPhone;
    }

    // Message detail
    if (lead.message) {
        const messageLength = lead.message.length;
        if (messageLength > 100) {
            score += weights.hasMessage;
        } else if (messageLength > 20) {
            score += weights.hasMessage * 0.5;
        }
    }

    // Project interest (specific project vs general inquiry)
    if (lead.projectId || lead.projectName) {
        score += weights.projectInterest;
    }

    // Budget range (higher budget = higher quality)
    if (lead.budget) {
        const budget = parseInt(lead.budget);
        if (budget > 10000000) {
            score += weights.budgetRange;
        } else if (budget > 5000000) {
            score += weights.budgetRange * 0.7;
        } else if (budget > 2000000) {
            score += weights.budgetRange * 0.4;
        }
    }

    // Source quality
    const sourceScores = {
        'direct': 1.0,
        'organic': 0.9,
        'referral': 0.8,
        'social': 0.6,
        'paid': 0.5,
    };

    if (lead.source && sourceScores[lead.source]) {
        score += weights.source * sourceScores[lead.source];
    }

    // Normalize to 0-100
    return Math.min(Math.round(score), 100);
}

export function getLeadPriority(score) {
    if (score >= 80) return { level: 'hot', label: 'Hot Lead', color: '#EF4444' };
    if (score >= 60) return { level: 'warm', label: 'Warm Lead', color: '#F59E0B' };
    if (score >= 40) return { level: 'cold', label: 'Cold Lead', color: '#3B82F6' };
    return { level: 'low', label: 'Low Priority', color: '#8A8AA3' };
}

export function enrichLeadData(lead) {
    const score = calculateLeadScore(lead);
    const priority = getLeadPriority(score);

    return {
        ...lead,
        score,
        priority: priority.level,
        priorityLabel: priority.label,
        priorityColor: priority.color,
    };
}

export default {
    calculateLeadScore,
    getLeadPriority,
    enrichLeadData,
};
