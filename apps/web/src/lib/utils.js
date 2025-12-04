// Number formatting utilities for financial data

export const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '$0';

    const num = parseFloat(value);
    const absNum = Math.abs(num);

    if (absNum >= 1e12) {
        return `$${(num / 1e12).toFixed(2)}T`;
    } else if (absNum >= 1e9) {
        return `$${(num / 1e9).toFixed(2)}B`;
    } else if (absNum >= 1e6) {
        return `$${(num / 1e6).toFixed(2)}M`;
    } else if (absNum >= 1e3) {
        return `$${(num / 1e3).toFixed(1)}K`;
    } else {
        return `$${num.toLocaleString()}`;
    }
};

export const formatNumberWords = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'Zero';

    const num = parseFloat(value);
    const absNum = Math.abs(num);

    if (absNum >= 1e12) {
        return `${(num / 1e12).toFixed(2)} Trillion`;
    } else if (absNum >= 1e9) {
        return `${(num / 1e9).toFixed(2)} Billion`;
    } else if (absNum >= 1e6) {
        return `${(num / 1e6).toFixed(2)} Million`;
    } else if (absNum >= 1e3) {
        return `${(num / 1e3).toFixed(1)} Thousand`;
    } else {
        return num.toLocaleString();
    }
};

export const formatPercent = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    return `${parseFloat(value).toFixed(1)}%`;
};

// Risk scoring utilities
export const calculateRiskScore = (factors) => {
    let score = 100;

    if (factors.hasAMLFlags) score -= 25;
    if (factors.isHighRiskJurisdiction) score -= 20;
    if (factors.hasPEPConnection) score -= 15;
    if (factors.hasAdverseMedia) score -= 15;
    if (factors.isNewEntity) score -= 10;
    if (factors.hasIncompleteKYC) score -= 10;
    if (factors.hasUnusualTransactions) score -= 5;

    return Math.max(0, score);
};

export const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'Low', color: 'emerald' };
    if (score >= 60) return { level: 'Medium', color: 'amber' };
    if (score >= 40) return { level: 'High', color: 'orange' };
    return { level: 'Critical', color: 'red' };
};

// Data storage utilities
export const DATA_KEYS = {
    CORPORATE_ACTIONS: 'omninexus_corporate_actions',
    DATA_ENTRIES: 'omninexus_data_entries',
    COMPLIANCE_HISTORY: 'omninexus_compliance_history',
    REPORTS: 'omninexus_reports',
    DEMO_MODE: 'omninexus_demo_mode',
    DEMO_USER: 'omninexus_demo_user',
    DEMO_DATA: 'omninexus_demo_data'
};

export const resetAllData = () => {
    Object.values(DATA_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
};

export const getStoredData = (key, defaultValue = []) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
};

export const setStoredData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};
