import React, { useState, useRef, useEffect } from 'react';
import {
    FileText, Download, BarChart2, TrendingUp,
    PieChart, Building, DollarSign, CheckCircle,
    RefreshCw, File, Search, ChevronDown, AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { formatNumber, getStoredData, DATA_KEYS } from '../lib/utils';

// Predefined list of companies for strict validation
const KNOWN_COMPANIES = [
    { id: 'c1', name: 'Acme Corporation', sector: 'Technology', ticker: 'ACME' },
    { id: 'c2', name: 'Globex Industries', sector: 'Industrial', ticker: 'GLBX' },
    { id: 'c3', name: 'Stark Industries', sector: 'Defense', ticker: 'STRK' },
    { id: 'c4', name: 'Wayne Enterprises', sector: 'Conglomerate', ticker: 'WAYN' },
    { id: 'c5', name: 'Umbrella Corp', sector: 'Pharmaceuticals', ticker: 'UMB' },
    { id: 'c6', name: 'Cyberdyne Systems', sector: 'Technology', ticker: 'CYBR' },
    { id: 'c7', name: 'Initech Solutions', sector: 'Software', ticker: 'INIT' },
    { id: 'c8', name: 'Massive Dynamic', sector: 'Conglomerate', ticker: 'MASS' },
    { id: 'c9', name: 'Soylent Corp', sector: 'Food & Beverage', ticker: 'SOYL' },
    { id: 'c10', name: 'Hooli', sector: 'Technology', ticker: 'HULI' },
];

const reportTypes = [
    {
        id: 'pitch_book',
        name: 'Pitch Book',
        icon: FileText,
        description: 'Comprehensive company overview and investment thesis',
        sections: ['Executive Summary', 'Market Analysis', 'Financial Highlights', 'Valuation', 'Key Risks'],
        formats: ['pdf', 'pptx']
    },
    {
        id: 'cim',
        name: 'Confidential Information Memorandum',
        icon: File,
        description: 'Detailed memorandum for potential buyers/investors',
        sections: ['Company Overview', 'Products/Services', 'Financial Performance', 'Management Team', 'Growth Strategy'],
        formats: ['pdf']
    },
    {
        id: 'teaser',
        name: 'Investment Teaser',
        icon: TrendingUp,
        description: 'One-page summary to generate initial interest',
        sections: ['Highlights', 'Key Metrics', 'Investment Highlights'],
        formats: ['pdf', 'pptx']
    },
    {
        id: 'financial_model',
        name: 'Financial Model',
        icon: BarChart2,
        description: 'Three-statement model with projections',
        sections: ['Income Statement', 'Balance Sheet', 'Cash Flow', 'DCF Analysis', 'Sensitivity'],
        formats: ['xlsx']
    },
    {
        id: 'market_analysis',
        name: 'Market Analysis Report',
        icon: BarChart2,
        description: 'Industry landscape and competitive positioning',
        sections: ['Market Size', 'Growth Trends', 'Competitive Landscape', 'Key Players'],
        formats: ['pdf', 'pptx']
    },
    {
        id: 'due_diligence',
        name: 'Due Diligence Report',
        icon: CheckCircle,
        description: 'Comprehensive DD findings and recommendations',
        sections: ['Financial DD', 'Commercial DD', 'Legal DD', 'Operational DD', 'Key Findings'],
        formats: ['pdf']
    },
    {
        id: 'aggregated_report',
        name: 'Aggregated Portfolio Report',
        icon: PieChart,
        description: 'Consolidated view of all active deals and exposure',
        sections: ['Portfolio Summary', 'Risk Analysis', 'Sector Allocation', 'Performance Metrics'],
        formats: ['pdf', 'xlsx']
    }
];

const mockGeneratedReports = [
    { id: 1, type: 'pitch_book', name: 'Acme Corp Pitch Book Q4 2024', createdAt: '2024-12-03T10:30:00', format: 'pdf', size: '4.2 MB' },
    { id: 2, type: 'financial_model', name: 'Globex Industries 3-Statement Model', createdAt: '2024-12-02T15:45:00', format: 'xlsx', size: '1.8 MB' },
    { id: 3, type: 'cim', name: 'Stark Industries CIM Draft', createdAt: '2024-12-01T09:15:00', format: 'pdf', size: '12.5 MB' },
];

// --- Helper Components ---

const CompanySelector = ({ value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCompanies = KNOWN_COMPANIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.ticker.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (company) => {
        onChange(company);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm text-slate-400 mb-2">Company / Deal Name *</label>
            <div
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg flex items-center justify-between cursor-pointer transition-colors ${error ? 'border-red-500/50' : 'border-slate-700 hover:border-slate-600'
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? 'text-white' : 'text-slate-500'}>
                    {value ? value.name : 'Select a company...'}
                </span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-slate-900 border-b border-slate-800">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search companies..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-primary-500"
                                autoFocus
                            />
                        </div>
                    </div>
                    {filteredCompanies.length > 0 ? (
                        filteredCompanies.map(company => (
                            <div
                                key={company.id}
                                onClick={() => handleSelect(company)}
                                className="px-4 py-3 hover:bg-slate-800 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-medium">{company.name}</span>
                                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                                        {company.ticker}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">{company.sector}</p>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">
                            No companies found
                        </div>
                    )}
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
};

// --- Generation Functions ---

const generatePDF = (company, reportType, sections) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helper for centered text
    const centerText = (text, y, size = 12, font = 'normal') => {
        doc.setFontSize(size);
        doc.setFont('helvetica', font);
        doc.text(text, pageWidth / 2, y, { align: 'center' });
    };

    // --- Cover Page ---
    // Background accent
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Logo placeholder
    doc.setFillColor(79, 70, 229); // Primary 600
    doc.circle(pageWidth / 2, 80, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('ON', pageWidth / 2, 82, { align: 'center' });

    // Title
    doc.setTextColor(255, 255, 255);
    centerText(reportType.name.toUpperCase(), 120, 24, 'bold');

    // Subtitle (Company Name)
    doc.setTextColor(148, 163, 184); // Slate 400
    centerText(company.name, 135, 18, 'normal');
    centerText(company.sector, 145, 14, 'normal');

    // Footer info
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 40, { align: 'center' });
    doc.text('STRICTLY PRIVATE & CONFIDENTIAL', pageWidth / 2, pageHeight - 30, { align: 'center' });

    // --- Content Pages ---

    sections.forEach((section, index) => {
        doc.addPage();

        // Header
        doc.setFillColor(248, 250, 252); // Slate 50
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(79, 70, 229);
        doc.setFontSize(10);
        doc.text('OmniNexus Intelligence', 20, 12);

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(section, 20, 22);

        doc.setDrawColor(226, 232, 240);
        doc.line(20, 30, pageWidth - 20, 30);

        // Content
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);

        const content = getSectionContent(section, company.name);
        const lines = doc.splitTextToSize(content, pageWidth - 40);
        doc.text(lines, 20, 50);

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(`Page ${index + 2}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
        doc.text('Confidential', 20, pageHeight - 10);
    });

    return doc;
};

const getSectionContent = (section, companyName) => {
    const contents = {
        'Executive Summary': `${companyName} represents a compelling investment opportunity in the current market environment. The company has demonstrated strong revenue growth of 25% YoY with EBITDA margins expanding to 18%. Key value drivers include market leadership, proprietary technology, and an experienced management team.`,
        'Market Analysis': `The target market is valued at $45B with a CAGR of 12% through 2028. ${companyName} holds approximately 15% market share and is positioned in the fastest-growing segment. Competitive dynamics favor established players with scale advantages.`,
        'Financial Highlights': `Revenue: $250M (FY2024E), EBITDA: $45M (18% margin), Net Debt: $75M (1.7x leverage), Free Cash Flow: $30M, Working Capital Cycle: 45 days. Historical growth rate of 22% CAGR over the past 5 years.`,
        'Valuation': `Based on comparable company analysis, the implied EV/EBITDA range is 8.0x-10.0x, suggesting an enterprise value of $360M-$450M. DCF analysis with a 10% WACC and 3% terminal growth rate yields a mid-point valuation of $420M.`,
        'Key Risks': `Primary risks include: (1) Customer concentration with top 5 customers representing 40% of revenue, (2) Regulatory changes in key markets, (3) Integration risk for recent acquisitions, (4) Foreign exchange exposure in international operations.`,
        'Company Overview': `${companyName} is a leading provider of enterprise solutions with operations across 15 countries. Founded in 2005, the company has grown to 500+ employees and serves Fortune 500 clients.`,
        'Products/Services': `Core offerings include SaaS platform (60% of revenue), Professional Services (25%), and Maintenance & Support (15%). The product portfolio has an NPS score of 72.`,
        'Financial Performance': `Strong financial track record with consistent profitability. Revenue CAGR of 20% over 5 years. Gross margin stable at 65%. Operating leverage improving with scale.`,
        'Management Team': `Experienced leadership team with average tenure of 8+ years. CEO has 25 years of industry experience. CFO previously at Fortune 100 company. Strong bench of operational leaders.`,
        'Growth Strategy': `Three-pronged growth strategy: (1) Organic expansion in existing markets, (2) New product development leveraging AI/ML, (3) Strategic M&A in adjacent verticals.`,
        'Highlights': `Premium market position, recurring revenue model, strong customer retention (95%), significant barriers to entry, and clear path to margin expansion.`,
        'Key Metrics': `ARR: $200M, Net Revenue Retention: 115%, CAC Payback: 18 months, LTV/CAC: 4.5x, Rule of 40: 48%.`,
        'Investment Highlights': `Attractive entry point at 8x forward EBITDA, multiple value creation levers, strong secular tailwinds, and clear exit optionality.`,
        'Income Statement': `Detailed 5-year income statement projection with revenue build-up, cost structure analysis, and margin assumptions.`,
        'Balance Sheet': `Pro forma balance sheet with working capital requirements, CapEx projections, and debt schedule.`,
        'Cash Flow': `Operating, investing, and financing cash flow projections with sensitivity analysis on key assumptions.`,
        'DCF Analysis': `Detailed discounted cash flow model with WACC calculation, terminal value, and sensitivity tables.`,
        'Sensitivity': `Key driver sensitivity analysis including revenue growth, EBITDA margin, WACC, and terminal growth rate scenarios.`,
        'Market Size': `Total addressable market of $100B with serviceable market of $30B. Expected to grow at 15% CAGR driven by digital transformation trends.`,
        'Growth Trends': `Key trends include cloud adoption, AI integration, regulatory compliance requirements, and consolidation among smaller players.`,
        'Competitive Landscape': `Fragmented market with top 5 players holding 35% share. Barriers to entry are high due to technology and customer relationships.`,
        'Key Players': `Major competitors include Company A (20% share), Company B (15% share), and several regional players. ${companyName} differentiates through technology and service quality.`,
        'Financial DD': `Detailed review of historical financials, quality of earnings analysis, working capital trends, and normalized EBITDA adjustments.`,
        'Commercial DD': `Customer interviews, competitive positioning assessment, pricing power analysis, and market share validation.`,
        'Legal DD': `Review of material contracts, litigation history, IP portfolio, and regulatory compliance status.`,
        'Operational DD': `Technology infrastructure assessment, organizational review, key person dependencies, and operational efficiency opportunities.`,
        'Key Findings': `Overall positive findings with manageable risk factors. Recommended proceed with transaction subject to identified integration workstreams.`,
        'Portfolio Summary': `Current portfolio consists of 12 active positions with total exposure of $2.5B. Average hold period of 3.2 years with blended IRR of 22%.`,
        'Risk Analysis': `Portfolio diversified across sectors with no single position exceeding 15% of total exposure. Credit quality weighted average of BB+.`,
        'Sector Allocation': `Technology (30%), Healthcare (25%), Industrial (20%), Consumer (15%), Financial Services (10%). Geographic focus on North America (60%) and Europe (40%).`,
        'Performance Metrics': `Gross IRR of 24%, Net IRR of 18%, MOIC of 2.1x, DPI of 0.8x. Outperforming benchmark by 400bps annually.`
    };
    return contents[section] || `Detailed analysis of ${section} for ${companyName}. This section contains comprehensive information and data relevant to the investment decision.`;
};

const generateExcel = (company, reportType, sections) => {
    const wb = XLSX.utils.book_new();

    // Cover sheet
    const coverData = [
        [reportType.name],
        [company.name],
        [company.sector],
        [''],
        ['Generated:', new Date().toLocaleDateString()],
        ['Platform:', 'OmniNexus Enterprise Intelligence Suite'],
        ['Classification:', 'Confidential'],
    ];
    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);
    XLSX.utils.book_append_sheet(wb, coverSheet, 'Cover');

    // Create sheets for each section
    sections.forEach((section) => {
        const sheetName = section.substring(0, 31); // Excel sheet name limit
        let sheetData;

        if (section === 'Income Statement') {
            sheetData = [
                ['Income Statement', '', 'FY2022', 'FY2023', 'FY2024E', 'FY2025E', 'FY2026E'],
                [''],
                ['Revenue', '', 165000000, 198000000, 250000000, 312500000, 390625000],
                ['Cost of Revenue', '', -57750000, -69300000, -87500000, -109375000, -136718750],
                ['Gross Profit', '', 107250000, 128700000, 162500000, 203125000, 253906250],
                ['Gross Margin', '', '65.0%', '65.0%', '65.0%', '65.0%', '65.0%'],
                [''],
                ['Operating Expenses', '', -77550000, -89100000, -107500000, -128125000, -152343750],
                ['EBITDA', '', 29700000, 39600000, 55000000, 75000000, 101562500],
                ['EBITDA Margin', '', '18.0%', '20.0%', '22.0%', '24.0%', '26.0%'],
                [''],
                ['D&A', '', -8250000, -9900000, -12500000, -15625000, -19531250],
                ['EBIT', '', 21450000, 29700000, 42500000, 59375000, 82031250],
                ['Interest Expense', '', -4500000, -4500000, -4500000, -4500000, -4500000],
                ['EBT', '', 16950000, 25200000, 38000000, 54875000, 77531250],
                ['Taxes (25%)', '', -4237500, -6300000, -9500000, -13718750, -19382813],
                ['Net Income', '', 12712500, 18900000, 28500000, 41156250, 58148438],
            ];
        } else if (section === 'Balance Sheet') {
            sheetData = [
                ['Balance Sheet', '', 'FY2022', 'FY2023', 'FY2024E', 'FY2025E', 'FY2026E'],
                [''],
                ['Assets'],
                ['Cash & Equivalents', '', 25000000, 35000000, 50000000, 75000000, 110000000],
                ['Accounts Receivable', '', 27500000, 33000000, 41667000, 52083000, 65104000],
                ['Inventory', '', 15000000, 18000000, 22500000, 28125000, 35156000],
                ['Total Current Assets', '', 67500000, 86000000, 114167000, 155208000, 210260000],
                [''],
                ['PP&E, Net', '', 45000000, 52000000, 60000000, 70000000, 82000000],
                ['Intangible Assets', '', 30000000, 28000000, 26000000, 24000000, 22000000],
                ['Total Assets', '', 142500000, 166000000, 200167000, 249208000, 314260000],
                [''],
                ['Liabilities'],
                ['Accounts Payable', '', 12000000, 14400000, 18000000, 22500000, 28125000],
                ['Accrued Expenses', '', 8000000, 9600000, 12000000, 15000000, 18750000],
                ['Current Debt', '', 10000000, 10000000, 10000000, 10000000, 10000000],
                ['Total Current Liab', '', 30000000, 34000000, 40000000, 47500000, 56875000],
                ['Long-term Debt', '', 65000000, 65000000, 65000000, 65000000, 65000000],
                ['Total Liabilities', '', 95000000, 99000000, 105000000, 112500000, 121875000],
                [''],
                ['Equity', '', 47500000, 67000000, 95167000, 136708000, 192385000],
            ];
        } else if (section === 'Cash Flow') {
            sheetData = [
                ['Cash Flow Statement', '', 'FY2022', 'FY2023', 'FY2024E', 'FY2025E', 'FY2026E'],
                [''],
                ['Operating Activities'],
                ['Net Income', '', 12712500, 18900000, 28500000, 41156250, 58148438],
                ['D&A', '', 8250000, 9900000, 12500000, 15625000, 19531250],
                ['Working Capital Changes', '', -3000000, -4500000, -6000000, -7500000, -9000000],
                ['Cash from Operations', '', 17962500, 24300000, 35000000, 49281250, 68679688],
                [''],
                ['Investing Activities'],
                ['CapEx', '', -12000000, -15000000, -18000000, -22000000, -26000000],
                ['Cash from Investing', '', -12000000, -15000000, -18000000, -22000000, -26000000],
                [''],
                ['Financing Activities'],
                ['Debt Repayment', '', -5000000, 0, 0, 0, 0],
                ['Dividends', '', -2000000, -2000000, -2000000, -2281250, -7679688],
                ['Cash from Financing', '', -7000000, -2000000, -2000000, -2281250, -7679688],
                [''],
                ['Net Change in Cash', '', -1037500, 7300000, 15000000, 25000000, 35000000],
            ];
        } else {
            sheetData = [
                [section],
                [''],
                ['Analysis Summary'],
                [getSectionContent(section, company.name)],
            ];
        }

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        ws['!cols'] = [{ wch: 25 }, { wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    return wb;
};

export default function Reports() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [generatedReports, setGeneratedReports] = useState(mockGeneratedReports);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        company: null,
        format: 'pdf',
        includeSections: []
    });

    const handleGenerate = () => {
        setError('');

        if (!selectedReport) {
            setError('Please select a report type first.');
            return;
        }

        if (!formData.company) {
            setError('Please select a company from the list.');
            return;
        }

        setGenerating(true);

        setTimeout(() => {
            const fileName = `${formData.company.name.replace(/\s+/g, '_')}_${selectedReport.name.replace(/\s+/g, '_')}`;

            try {
                if (formData.format === 'pdf' || formData.format === 'pptx') {
                    const doc = generatePDF(formData.company, selectedReport, selectedReport.sections);
                    doc.save(`${fileName}.pdf`);
                } else if (formData.format === 'xlsx') {
                    const wb = generateExcel(formData.company, selectedReport, selectedReport.sections);
                    XLSX.writeFile(wb, `${fileName}.xlsx`);
                }

                const newReport = {
                    id: Date.now(),
                    type: selectedReport.id,
                    name: `${formData.company.name} ${selectedReport.name}`,
                    createdAt: new Date().toISOString(),
                    format: formData.format === 'pptx' ? 'pdf' : formData.format,
                    size: formData.format === 'xlsx' ? '1.2 MB' : '2.5 MB'
                };

                setGeneratedReports([newReport, ...generatedReports]);
                setShowSuccess(true);
                setError('');
            } catch (err) {
                console.error('Error generating report:', err);
                setError('Failed to generate report. Please try again.');
            }

            setGenerating(false);
            setSelectedReport(null);
            setFormData({ company: null, format: 'pdf', includeSections: [] });

            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    const handleDownloadExisting = (report) => {
        const reportType = reportTypes.find(r => r.id === report.type);
        if (!reportType) return;

        // Try to extract company name or use default
        const companyName = report.name.split(' ')[0] + ' ' + (report.name.split(' ')[1] || '');
        const company = KNOWN_COMPANIES.find(c => c.name.includes(companyName)) || { name: companyName, sector: 'Unknown' };

        if (report.format === 'xlsx') {
            const wb = generateExcel(company, reportType, reportType.sections);
            XLSX.writeFile(wb, `${report.name.replace(/\s+/g, '_')}.xlsx`);
        } else {
            const doc = generatePDF(company, reportType, reportType.sections);
            doc.save(`${report.name.replace(/\s+/g, '_')}.pdf`);
        }
    };

    const getFormatIcon = (format) => {
        if (format === 'xlsx') return BarChart2;
        if (format === 'pptx') return BarChart2;
        return FileText;
    };

    const corporateActions = getStoredData(DATA_KEYS.CORPORATE_ACTIONS, []);
    const dataEntries = getStoredData(DATA_KEYS.DATA_ENTRIES, []);

    let totalExposure = 0;
    try {
        totalExposure = corporateActions.reduce((sum, a) => {
            if (typeof a.amount === 'number') return sum + a.amount;
            const amountStr = String(a.amount || '0');
            const amount = parseFloat(amountStr.replace(/[$,BMK]/g, '') || 0);
            const multiplier = amountStr.includes('B') ? 1e9 : amountStr.includes('M') ? 1e6 : amountStr.includes('K') ? 1e3 : 1;
            return sum + (amount * multiplier);
        }, 0);
    } catch (error) {
        totalExposure = 0;
    }

    return (
        <div className="space-y-6">
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-pulse">
                    <CheckCircle size={20} />
                    <span>Report generated and downloaded!</span>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Reports</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{generatedReports.length}</h3>
                        </div>
                        <FileText className="text-blue-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Active Deals</p>
                            <h3 className="text-2xl font-bold text-purple-400 mt-1">{corporateActions.length || 8}</h3>
                        </div>
                        <Building className="text-purple-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Exposure</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{formatNumber(totalExposure || 5.6e9)}</h3>
                        </div>
                        <DollarSign className="text-emerald-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Data Points</p>
                            <h3 className="text-2xl font-bold text-amber-400 mt-1">{dataEntries.length || 5}</h3>
                        </div>
                        <BarChart2 className="text-amber-400" size={24} />
                    </div>
                </div>
            </div>

            {/* Report Selection Grid */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Generate Investment Banking Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reportTypes.map((report) => (
                        <div
                            key={report.id}
                            onClick={() => setSelectedReport(report)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedReport?.id === report.id
                                ? 'bg-primary-500/10 border-primary-500'
                                : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`p-3 rounded-lg ${selectedReport?.id === report.id ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    <report.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-white">{report.name}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{report.description}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        {report.formats.map(fmt => (
                                            <span key={fmt} className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded uppercase">
                                                {fmt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Configuration Form */}
            {selectedReport && (
                <div className="bg-slate-850 rounded-xl border border-slate-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Configure: {selectedReport.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <CompanySelector
                                value={formData.company}
                                onChange={(company) => setFormData({ ...formData, company })}
                                error={error && !formData.company ? 'Required' : null}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Output Format</label>
                            <select
                                value={formData.format}
                                onChange={e => setFormData({ ...formData, format: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                {selectedReport.formats.map(fmt => (
                                    <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm text-slate-400 mb-3">Sections to Include</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {selectedReport.sections.map(section => (
                                <label key={section} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-slate-300">{section}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center space-x-2">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={() => { setSelectedReport(null); setError(''); }}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                        >
                            {generating ? (
                                <>
                                    <RefreshCw className="animate-spin" size={18} />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    <span>Generate & Download</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Recent Reports Table */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
                </div>
                <div className="divide-y divide-slate-800">
                    {generatedReports.map((report) => {
                        const FormatIcon = getFormatIcon(report.format);
                        const reportType = reportTypes.find(r => r.id === report.type);

                        return (
                            <div key={report.id} className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-slate-800 rounded-lg">
                                        <FormatIcon size={20} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{report.name}</h4>
                                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                                            <span>{reportType?.name}</span>
                                            <span>•</span>
                                            <span className="uppercase">{report.format}</span>
                                            <span>•</span>
                                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownloadExisting(report)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                                >
                                    <Download size={16} />
                                    <span>Download</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
