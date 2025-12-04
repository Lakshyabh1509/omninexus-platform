import React, { useState, useEffect } from 'react';
import {
    Shield, AlertTriangle, CheckCircle, Search, FileText, User, Building,
    Globe, RefreshCw, Download, Clock, XCircle, AlertCircle, TrendingUp,
    Eye, FileWarning, Scale, Users
} from 'lucide-react';
import { calculateRiskScore, getRiskLevel, getStoredData, setStoredData, DATA_KEYS } from '../lib/utils';

const complianceChecks = [
    { id: 'kyc', name: 'KYC Verification', icon: User, weight: 20 },
    { id: 'aml', name: 'AML Screening', icon: Shield, weight: 25 },
    { id: 'pep', name: 'PEP Check', icon: Users, weight: 15 },
    { id: 'sanctions', name: 'Sanctions Screening', icon: Globe, weight: 25 },
    { id: 'adverse', name: 'Adverse Media', icon: FileWarning, weight: 10 },
    { id: 'jurisdiction', name: 'Jurisdiction Risk', icon: Scale, weight: 5 },
];

const mockEntities = [
    { name: 'Acme Corporation', jurisdiction: 'USA', type: 'Corporate', registered: '2015-03-15' },
    { name: 'Globex Industries', jurisdiction: 'Germany', type: 'Corporate', registered: '2010-08-22' },
    { name: 'Umbrella Corp', jurisdiction: 'Cayman Islands', type: 'Corporate', registered: '2018-01-10' },
    { name: 'Wayne Enterprises', jurisdiction: 'USA', type: 'Corporate', registered: '1985-04-07' },
    { name: 'Stark Industries', jurisdiction: 'USA', type: 'Corporate', registered: '1992-11-30' },
];

const highRiskJurisdictions = ['Cayman Islands', 'Panama', 'British Virgin Islands', 'Seychelles'];

export default function ComplianceSentinel() {
    const [entitySearch, setEntitySearch] = useState('');
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scanResults, setScanResults] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory(getStoredData(DATA_KEYS.COMPLIANCE_HISTORY, []));
    }, []);

    const runComplianceScan = () => {
        if (!entitySearch.trim()) return;

        setScanning(true);
        setScanResults(null);

        // Find or create entity
        const foundEntity = mockEntities.find(e =>
            e.name.toLowerCase().includes(entitySearch.toLowerCase())
        ) || {
            name: entitySearch,
            jurisdiction: ['USA', 'UK', 'Germany', 'Cayman Islands'][Math.floor(Math.random() * 4)],
            type: 'Unknown',
            registered: 'Unknown'
        };

        setSelectedEntity(foundEntity);

        // Simulate scanning delay
        setTimeout(() => {
            const isHighRisk = highRiskJurisdictions.includes(foundEntity.jurisdiction);

            // Generate realistic check results
            const checks = complianceChecks.map(check => {
                let status = 'pass';
                let details = '';

                if (check.id === 'jurisdiction' && isHighRisk) {
                    status = 'fail';
                    details = `High-risk jurisdiction: ${foundEntity.jurisdiction}`;
                } else if (check.id === 'aml' && Math.random() > 0.7) {
                    status = 'warning';
                    details = 'Unusual transaction patterns detected';
                } else if (check.id === 'pep' && Math.random() > 0.8) {
                    status = 'warning';
                    details = 'Potential PEP connection identified';
                } else if (check.id === 'adverse' && Math.random() > 0.85) {
                    status = 'warning';
                    details = 'Minor adverse media mentions found';
                } else if (check.id === 'sanctions' && Math.random() > 0.95) {
                    status = 'fail';
                    details = 'Match found in sanctions database';
                } else if (check.id === 'kyc') {
                    status = foundEntity.type === 'Unknown' ? 'warning' : 'pass';
                    details = foundEntity.type === 'Unknown' ? 'Incomplete documentation' : 'All documents verified';
                }

                return { ...check, status, details };
            });

            const factors = {
                hasAMLFlags: checks.find(c => c.id === 'aml')?.status !== 'pass',
                isHighRiskJurisdiction: isHighRisk,
                hasPEPConnection: checks.find(c => c.id === 'pep')?.status !== 'pass',
                hasAdverseMedia: checks.find(c => c.id === 'adverse')?.status !== 'pass',
                isNewEntity: new Date(foundEntity.registered) > new Date('2020-01-01'),
                hasIncompleteKYC: checks.find(c => c.id === 'kyc')?.status !== 'pass',
                hasUnusualTransactions: Math.random() > 0.8
            };

            const riskScore = calculateRiskScore(factors);
            const riskLevel = getRiskLevel(riskScore);

            const result = {
                entity: foundEntity,
                checks,
                riskScore,
                riskLevel,
                timestamp: new Date().toISOString(),
                recommendations: generateRecommendations(checks, riskLevel)
            };

            setScanResults(result);
            setScanning(false);

            // Save to history
            const newHistory = [result, ...history].slice(0, 10);
            setHistory(newHistory);
            setStoredData(DATA_KEYS.COMPLIANCE_HISTORY, newHistory);
        }, 2000);
    };

    const generateRecommendations = (checks, riskLevel) => {
        const recs = [];
        checks.forEach(check => {
            if (check.status === 'fail') {
                recs.push({ type: 'critical', text: `Immediate action required: ${check.name} - ${check.details}` });
            } else if (check.status === 'warning') {
                recs.push({ type: 'warning', text: `Review recommended: ${check.name} - ${check.details}` });
            }
        });

        if (riskLevel.level === 'Critical' || riskLevel.level === 'High') {
            recs.push({ type: 'action', text: 'Escalate to compliance officer for enhanced due diligence' });
        }

        return recs.length > 0 ? recs : [{ type: 'success', text: 'No immediate actions required. Standard monitoring applies.' }];
    };

    const StatusIcon = ({ status }) => {
        if (status === 'pass') return <CheckCircle className="text-emerald-400" size={20} />;
        if (status === 'warning') return <AlertCircle className="text-amber-400" size={20} />;
        return <XCircle className="text-red-400" size={20} />;
    };

    return (
        <div className="space-y-6">
            {/* Header with Search */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Compliance Sentinel</h2>
                        <p className="text-slate-400 text-sm">Real-time KYC, AML & Sanctions Screening</p>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            value={entitySearch}
                            onChange={(e) => setEntitySearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && runComplianceScan()}
                            placeholder="Enter entity name, LEI, or registration number..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={runComplianceScan}
                        disabled={scanning || !entitySearch.trim()}
                        className="px-6 py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                    >
                        {scanning ? (
                            <RefreshCw className="animate-spin" size={20} />
                        ) : (
                            <Shield size={20} />
                        )}
                        <span>{scanning ? 'Scanning...' : 'Run Compliance Check'}</span>
                    </button>
                </div>
            </div>

            {/* Scan Results */}
            {scanResults && (
                <div className="space-y-6">
                    {/* Risk Score Card */}
                    <div className={`bg-${scanResults.riskLevel.color}-500/10 border border-${scanResults.riskLevel.color}-500/20 rounded-xl p-6`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`w-20 h-20 rounded-full bg-${scanResults.riskLevel.color}-500/20 flex items-center justify-center`}>
                                    <span className={`text-3xl font-bold text-${scanResults.riskLevel.color}-400`}>{scanResults.riskScore}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{scanResults.entity.name}</h3>
                                    <p className={`text-${scanResults.riskLevel.color}-400 font-medium`}>
                                        {scanResults.riskLevel.level} Risk
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        {scanResults.entity.jurisdiction} • {scanResults.entity.type}
                                    </p>
                                </div>
                            </div>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                                <Download size={18} />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    {/* Check Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scanResults.checks.map((check) => (
                            <div key={check.id} className="bg-slate-850 rounded-xl border border-slate-800 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <check.icon className="text-slate-400" size={20} />
                                        <span className="font-medium text-white">{check.name}</span>
                                    </div>
                                    <StatusIcon status={check.status} />
                                </div>
                                <p className="text-sm text-slate-400">
                                    {check.details || (check.status === 'pass' ? 'No issues detected' : 'Check pending')}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Recommendations */}
                    <div className="bg-slate-850 rounded-xl border border-slate-800 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                        <div className="space-y-3">
                            {scanResults.recommendations.map((rec, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border ${rec.type === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                        rec.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            rec.type === 'action' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        }`}
                                >
                                    {rec.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Scan History */}
            {history.length > 0 && !scanResults && (
                <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="text-lg font-semibold text-white">Recent Scans</h3>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {history.map((scan, idx) => (
                            <div key={idx} className="p-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
                                onClick={() => setScanResults(scan)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-full bg-${scan.riskLevel.color}-500/20 flex items-center justify-center`}>
                                            <span className={`text-sm font-bold text-${scan.riskLevel.color}-400`}>{scan.riskScore}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{scan.entity.name}</p>
                                            <p className="text-sm text-slate-500">{new Date(scan.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${scan.riskLevel.color}-500/10 text-${scan.riskLevel.color}-400`}>
                                        {scan.riskLevel.level}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending Deliverables Tracker */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Pending Deliverables</h3>
                        <p className="text-sm text-slate-400">Track missing compliance documents and deadlines</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium">
                        4 Overdue
                    </span>
                </div>
                <div className="divide-y divide-slate-800">
                    {[
                        { doc: 'Annual Financial Statements', entity: 'Acme Corporation', due: '2024-11-30', status: 'overdue', priority: 'high' },
                        { doc: 'Beneficial Ownership Declaration', entity: 'Globex Industries', due: '2024-12-01', status: 'overdue', priority: 'critical' },
                        { doc: 'AML Certification Renewal', entity: 'Wayne Enterprises', due: '2024-12-03', status: 'overdue', priority: 'high' },
                        { doc: 'Board Resolution', entity: 'Umbrella Corp', due: '2024-12-02', status: 'overdue', priority: 'medium' },
                        { doc: 'Updated KYC Documents', entity: 'Stark Industries', due: '2024-12-10', status: 'pending', priority: 'medium' },
                        { doc: 'Quarterly Compliance Report', entity: 'Acme Corporation', due: '2024-12-15', status: 'pending', priority: 'low' },
                        { doc: 'Risk Assessment Update', entity: 'Globex Industries', due: '2024-12-20', status: 'pending', priority: 'medium' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-4 hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${item.priority === 'critical' ? 'bg-red-500/20' :
                                            item.priority === 'high' ? 'bg-amber-500/20' :
                                                item.priority === 'medium' ? 'bg-blue-500/20' : 'bg-slate-700'
                                        }`}>
                                        <FileText size={18} className={
                                            item.priority === 'critical' ? 'text-red-400' :
                                                item.priority === 'high' ? 'text-amber-400' :
                                                    item.priority === 'medium' ? 'text-blue-400' : 'text-slate-400'
                                        } />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{item.doc}</p>
                                        <p className="text-sm text-slate-500">{item.entity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className={`text-sm font-medium ${item.status === 'overdue' ? 'text-red-400' : 'text-slate-400'
                                            }`}>
                                            {item.status === 'overdue' ? 'Overdue' : 'Due'}: {item.due}
                                        </p>
                                        <span className={`text-xs uppercase ${item.priority === 'critical' ? 'text-red-400' :
                                                item.priority === 'high' ? 'text-amber-400' :
                                                    item.priority === 'medium' ? 'text-blue-400' : 'text-slate-500'
                                            }`}>
                                            {item.priority} priority
                                        </span>
                                    </div>
                                    <button className="px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded-lg text-sm transition-colors">
                                        Send Reminder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
