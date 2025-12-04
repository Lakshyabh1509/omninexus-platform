import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Building2, DollarSign, TrendingUp, AlertTriangle,
    CheckCircle, Clock, FileText, X, ChevronRight, Calendar, Users,
    BarChart2, Shield, AlertCircle, ExternalLink
} from 'lucide-react';
import { formatNumber } from '../lib/utils';

// Generate 50+ synthetic loans
const generateLoans = () => {
    const borrowers = [
        'Acme Industries', 'Global Tech Solutions', 'Pacific Energy Corp', 'Atlantic Healthcare',
        'Summit Manufacturing', 'Nexus Financial', 'Horizon Logistics', 'Apex Pharmaceuticals',
        'Sterling Aerospace', 'Pinnacle Resources', 'Quantum Networks', 'Titan Construction',
        'Vanguard Capital', 'Meridian Properties', 'Crown Holdings', 'Liberty Enterprises',
        'Phoenix Group', 'Eagle Dynamics', 'Orion Systems', 'Atlas Mining',
        'Delta Transport', 'Omega Energy', 'Nova Biotech', 'Prime Manufacturing',
        'Elite Services', 'Core Industries', 'Unity Holdings', 'Fusion Tech',
        'Impact Ventures', 'Catalyst Partners', 'Matrix Solutions', 'Synergy Corp',
        'Vertex Capital', 'Zenith Group', 'Apex Holdings', 'Prime Capital',
        'Summit Advisors', 'Horizon Partners', 'Bridge Capital', 'Gateway Investments',
        'Landmark Industries', 'Pioneer Systems', 'Frontier Energy', 'Cascade Resources',
        'Keystone Holdings', 'Archer Financial', 'Compass Group', 'Beacon Capital',
        'Northstar Ventures', 'Trident Industries', 'Evergreen Capital', 'Silverline Corp'
    ];

    const loanTypes = ['Term Loan A', 'Term Loan B', 'Revolver', 'Bridge Loan', 'Mezzanine'];
    const statuses = ['Current', 'Watch List', 'Default', 'Restructured'];
    const industries = ['Technology', 'Healthcare', 'Energy', 'Manufacturing', 'Finance', 'Real Estate', 'Logistics', 'Retail'];

    return borrowers.map((borrower, i) => ({
        id: `LN-${String(i + 1001).padStart(6, '0')}`,
        borrower,
        industry: industries[i % industries.length],
        loanType: loanTypes[i % loanTypes.length],
        commitment: Math.floor(50 + Math.random() * 450) * 1000000,
        outstanding: Math.floor(30 + Math.random() * 300) * 1000000,
        maturityDate: new Date(2025 + Math.floor(i / 10), (i * 3) % 12, 15).toISOString().split('T')[0],
        interestRate: (4 + Math.random() * 4).toFixed(2) + '%',
        status: statuses[Math.floor(Math.random() * 4)],
        covenantStatus: Math.random() > 0.2 ? 'Compliant' : Math.random() > 0.5 ? 'Warning' : 'Breach',
        lastReview: new Date(2024, 10 + Math.floor(Math.random() * 2), Math.floor(1 + Math.random() * 28)).toISOString().split('T')[0],
        agent: ['JP Morgan', 'Bank of America', 'Wells Fargo', 'Citi', 'Goldman Sachs'][i % 5],
        covenants: [
            { name: 'Debt/EBITDA', threshold: '< 4.0x', actual: (3 + Math.random() * 2).toFixed(2) + 'x', status: Math.random() > 0.3 ? 'pass' : 'breach' },
            { name: 'Interest Coverage', threshold: '> 2.5x', actual: (2 + Math.random() * 2).toFixed(2) + 'x', status: Math.random() > 0.2 ? 'pass' : 'warning' },
            { name: 'Current Ratio', threshold: '> 1.2x', actual: (1 + Math.random() * 0.8).toFixed(2) + 'x', status: Math.random() > 0.25 ? 'pass' : 'breach' },
            { name: 'CapEx Limit', threshold: '< $25M', actual: '$' + (15 + Math.random() * 15).toFixed(1) + 'M', status: Math.random() > 0.15 ? 'pass' : 'warning' },
        ],
        events: [
            { date: '2024-11-15', type: 'Quarterly Review', description: 'Q3 2024 covenant compliance verified' },
            { date: '2024-09-01', type: 'Amendment', description: 'Margin adjustment of 25bps' },
            { date: '2024-06-15', type: 'Draw', description: 'Revolver draw of $15M' },
            { date: '2024-03-01', type: 'Repricing', description: 'Interest rate repriced to SOFR + 275bps' },
        ],
        documents: [
            { name: 'Credit Agreement', date: '2023-01-15', type: 'Legal' },
            { name: 'Q3 2024 Financials', date: '2024-10-30', type: 'Financial' },
            { name: 'Compliance Certificate', date: '2024-11-15', type: 'Compliance' },
            { name: 'Borrowing Base Certificate', date: '2024-11-01', type: 'Operational' },
        ]
    }));
};

const loans = generateLoans();

export default function Loans() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [industryFilter, setIndustryFilter] = useState('all');
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const filteredLoans = useMemo(() => {
        return loans.filter(loan => {
            const matchesSearch = loan.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loan.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
            const matchesIndustry = industryFilter === 'all' || loan.industry === industryFilter;
            return matchesSearch && matchesStatus && matchesIndustry;
        });
    }, [searchTerm, statusFilter, industryFilter]);

    const stats = useMemo(() => {
        const total = loans.reduce((sum, l) => sum + l.outstanding, 0);
        const compliant = loans.filter(l => l.covenantStatus === 'Compliant').length;
        const warning = loans.filter(l => l.covenantStatus === 'Warning').length;
        const breach = loans.filter(l => l.covenantStatus === 'Breach').length;
        return { total, compliant, warning, breach };
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Current': return 'text-emerald-400 bg-emerald-500/10';
            case 'Watch List': return 'text-amber-400 bg-amber-500/10';
            case 'Default': return 'text-red-400 bg-red-500/10';
            case 'Restructured': return 'text-purple-400 bg-purple-500/10';
            default: return 'text-slate-400 bg-slate-500/10';
        }
    };

    const getCovenantColor = (status) => {
        switch (status) {
            case 'Compliant': return 'text-emerald-400';
            case 'Warning': return 'text-amber-400';
            case 'Breach': return 'text-red-400';
            default: return 'text-slate-400';
        }
    };

    const industries = [...new Set(loans.map(l => l.industry))];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Outstanding</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{formatNumber(stats.total)}</h3>
                        </div>
                        <DollarSign className="text-blue-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Compliant</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats.compliant}</h3>
                        </div>
                        <CheckCircle className="text-emerald-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Warning</p>
                            <h3 className="text-2xl font-bold text-amber-400 mt-1">{stats.warning}</h3>
                        </div>
                        <AlertTriangle className="text-amber-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Breach</p>
                            <h3 className="text-2xl font-bold text-red-400 mt-1">{stats.breach}</h3>
                        </div>
                        <AlertCircle className="text-red-400" size={24} />
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by borrower or loan ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Current">Current</option>
                            <option value="Watch List">Watch List</option>
                            <option value="Default">Default</option>
                            <option value="Restructured">Restructured</option>
                        </select>
                        <select
                            value={industryFilter}
                            onChange={(e) => setIndustryFilter(e.target.value)}
                            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="all">All Industries</option>
                            {industries.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Loans Table */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Loan Portfolio ({filteredLoans.length} loans)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Loan ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Borrower</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Industry</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Outstanding</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Maturity</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Covenants</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredLoans.slice(0, 20).map((loan) => (
                                <tr
                                    key={loan.id}
                                    onClick={() => setSelectedLoan(loan)}
                                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm font-mono text-slate-300">{loan.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <Building2 size={16} className="text-slate-500" />
                                            <span className="text-sm font-medium text-white">{loan.borrower}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-400">{loan.industry}</td>
                                    <td className="px-4 py-3 text-sm text-slate-400">{loan.loanType}</td>
                                    <td className="px-4 py-3 text-sm text-right font-medium text-white">{formatNumber(loan.outstanding)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-400">{loan.maturityDate}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(loan.status)}`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-sm font-medium ${getCovenantColor(loan.covenantStatus)}`}>
                                            {loan.covenantStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <ChevronRight size={16} className="text-slate-500" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredLoans.length > 20 && (
                    <div className="p-4 border-t border-slate-800 text-center">
                        <span className="text-sm text-slate-500">Showing 20 of {filteredLoans.length} loans</span>
                    </div>
                )}
            </div>

            {/* Loan Detail Modal */}
            {selectedLoan && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-850 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedLoan.borrower}</h2>
                                <p className="text-sm text-slate-400 mt-1">{selectedLoan.id} • {selectedLoan.loanType} • {selectedLoan.agent}</p>
                            </div>
                            <button onClick={() => setSelectedLoan(null)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-800">
                            {['overview', 'covenants', 'events', 'documents'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab
                                        ? 'text-primary-400 border-b-2 border-primary-400'
                                        : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-900 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Commitment</p>
                                        <p className="text-lg font-bold text-white">{formatNumber(selectedLoan.commitment)}</p>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Outstanding</p>
                                        <p className="text-lg font-bold text-white">{formatNumber(selectedLoan.outstanding)}</p>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Interest Rate</p>
                                        <p className="text-lg font-bold text-white">{selectedLoan.interestRate}</p>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Maturity</p>
                                        <p className="text-lg font-bold text-white">{selectedLoan.maturityDate}</p>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Status</p>
                                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedLoan.status)}`}>
                                            {selectedLoan.status}
                                        </span>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Last Review</p>
                                        <p className="text-lg font-bold text-white">{selectedLoan.lastReview}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'covenants' && (
                                <div className="space-y-4">
                                    {selectedLoan.covenants.map((cov, i) => (
                                        <div key={i} className="bg-slate-900 p-4 rounded-xl flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-white">{cov.name}</h4>
                                                <p className="text-sm text-slate-400">Threshold: {cov.threshold}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white">{cov.actual}</p>
                                                <span className={`text-sm ${cov.status === 'pass' ? 'text-emerald-400' : cov.status === 'warning' ? 'text-amber-400' : 'text-red-400'}`}>
                                                    {cov.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'events' && (
                                <div className="space-y-4">
                                    {selectedLoan.events.map((event, i) => (
                                        <div key={i} className="bg-slate-900 p-4 rounded-xl flex items-start space-x-4">
                                            <div className="p-2 bg-slate-800 rounded-lg">
                                                <Clock size={18} className="text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-white">{event.type}</h4>
                                                    <span className="text-sm text-slate-500">{event.date}</span>
                                                </div>
                                                <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div className="space-y-3">
                                    {selectedLoan.documents.map((doc, i) => (
                                        <div key={i} className="bg-slate-900 p-4 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <FileText size={20} className="text-slate-400" />
                                                <div>
                                                    <h4 className="font-medium text-white">{doc.name}</h4>
                                                    <p className="text-xs text-slate-500">{doc.type} • {doc.date}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                                <ExternalLink size={16} className="text-slate-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
