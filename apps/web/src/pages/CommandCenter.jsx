import React, { useState, useEffect } from 'react';
import {
    TrendingUp, AlertTriangle, CheckCircle, Clock, Building2, Plus, X, Trash2,
    DollarSign
} from 'lucide-react';
import { formatNumber, formatNumberWords, getStoredData, setStoredData, DATA_KEYS } from '../lib/utils';

const defaultData = [
    { id: 'LN-2024-001', client: 'Acme Corporation', type: 'Restructuring', amount: 150000000, status: 'Critical', deadline: '2024-12-10', progress: 45, notes: 'Urgent review needed. Client requested extension on covenants.' },
    { id: 'LN-2024-002', client: 'Globex Industries', type: 'New Issuance', amount: 500000000, status: 'Active', deadline: '2024-12-15', progress: 72, notes: 'Documentation complete. Awaiting final approvals.' },
    { id: 'LN-2024-003', client: 'Soylent Corp', type: 'Covenant Check', amount: 75000000, status: 'Compliant', deadline: '2024-12-20', progress: 100, notes: 'All covenants met. Quarterly review passed.' },
    { id: 'LN-2024-004', client: 'Initech Solutions', type: 'Restructuring', amount: 200000000, status: 'Active', deadline: '2024-12-25', progress: 60, notes: 'In negotiation phase with stakeholders.' },
    { id: 'LN-2024-005', client: 'Umbrella Corp', type: 'Audit', amount: 1200000000, status: 'Critical', deadline: '2024-12-05', progress: 25, notes: 'Immediate attention required. Compliance issues identified.' },
    { id: 'LN-2024-006', client: 'Wayne Enterprises', type: 'New Issuance', amount: 800000000, status: 'Active', deadline: '2024-12-18', progress: 85, notes: 'Near completion. Final review scheduled.' },
    { id: 'LN-2024-007', client: 'Stark Industries', type: 'Covenant Check', amount: 2500000000, status: 'Compliant', deadline: '2024-12-22', progress: 100, notes: 'Excellent performance metrics.' },
    { id: 'LN-2024-008', client: 'Cyberdyne Systems', type: 'Restructuring', amount: 350000000, status: 'Critical', deadline: '2024-12-08', progress: 30, notes: 'Complex restructuring. Multiple parties involved.' },
];

const StatusBadge = ({ status }) => {
    const styles = {
        Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
        Active: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Compliant: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };

    const icons = { Critical: AlertTriangle, Active: TrendingUp, Compliant: CheckCircle };
    const Icon = icons[status];

    return (
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
            <Icon size={14} />
            <span>{status}</span>
        </span>
    );
};

const ProgressBar = ({ value }) => (
    <div className="w-full bg-slate-700 rounded-full h-2">
        <div
            className={`h-2 rounded-full ${value >= 100 ? 'bg-emerald-500' : value >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
            style={{ width: `${value}%` }}
        />
    </div>
);

export default function CommandCenter() {
    const [data, setData] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [selectedHeatmapDay, setSelectedHeatmapDay] = useState(null);
    const [newAction, setNewAction] = useState({
        client: '', type: 'Restructuring', amount: '', status: 'Active', deadline: '', notes: ''
    });

    useEffect(() => {
        const stored = getStoredData(DATA_KEYS.CORPORATE_ACTIONS, []);
        if (stored.length === 0) {
            setData(defaultData);
            setStoredData(DATA_KEYS.CORPORATE_ACTIONS, defaultData);
        } else {
            setData(stored);
        }
    }, []);

    const saveData = (newData) => {
        setData(newData);
        setStoredData(DATA_KEYS.CORPORATE_ACTIONS, newData);
    };

    const criticalCount = data.filter(d => d.status === 'Critical').length;
    const activeCount = data.filter(d => d.status === 'Active').length;
    const compliantCount = data.filter(d => d.status === 'Compliant').length;
    const totalExposure = data.reduce((sum, d) => sum + (d.amount || 0), 0);

    const handleAddAction = () => {
        const id = `LN-2024-${String(data.length + 1).padStart(3, '0')}`;
        const amount = parseFloat(newAction.amount.replace(/[$,]/g, '')) || 0;
        const action = { ...newAction, id, amount, progress: 0 };
        saveData([action, ...data]);
        setNewAction({ client: '', type: 'Restructuring', amount: '', status: 'Active', deadline: '', notes: '' });
        setShowAddForm(false);
    };

    const handleDeleteAction = (id) => {
        saveData(data.filter(d => d.id !== id));
        setSelectedAction(null);
        setDeleteConfirm(null);
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Actions</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{data.length}</h3>
                        </div>
                        <Building2 className="text-purple-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Exposure</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{formatNumber(totalExposure)}</h3>
                            <p className="text-xs text-slate-500">{formatNumberWords(totalExposure)}</p>
                        </div>
                        <DollarSign className="text-emerald-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Active</p>
                            <h3 className="text-2xl font-bold text-blue-400 mt-1">{activeCount}</h3>
                        </div>
                        <TrendingUp className="text-blue-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Critical</p>
                            <h3 className="text-2xl font-bold text-red-400 mt-1">{criticalCount}</h3>
                        </div>
                        <AlertTriangle className="text-red-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Compliant</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{compliantCount}</h3>
                        </div>
                        <CheckCircle className="text-emerald-400" size={24} />
                    </div>
                </div>
            </div>

            {/* Compliance Heatmap & Recent Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compliance Heatmap */}
                <div className="lg:col-span-2 bg-slate-850 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Compliance Heatmap - December 2024</h2>
                    <div className="grid grid-cols-7 gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-xs text-center text-slate-500 mb-2">{day}</div>
                        ))}
                        {(() => {
                            const heatmapEvents = [
                                { day: 1, status: 'compliant', events: [{ client: 'Stark Industries', action: 'Covenant check passed', time: '09:00 AM' }] },
                                { day: 2, status: 'warning', events: [{ client: 'Globex Industries', action: 'Deadline approaching', time: '02:30 PM' }] },
                                { day: 3, status: 'warning', events: [{ client: 'Acme Corp', action: 'Document pending review', time: '11:15 AM' }] },
                                { day: 4, status: 'compliant', events: [{ client: 'Wayne Enterprises', action: 'Quarterly review complete', time: '04:00 PM' }] },
                                { day: 5, status: 'breach', events: [{ client: 'Umbrella Corp', action: 'Interest coverage breach', time: '10:00 AM' }, { client: 'Initech', action: 'Late payment', time: '03:00 PM' }] },
                                { day: 6, status: 'compliant', events: [] },
                                { day: 7, status: 'breach', events: [{ client: 'Cyberdyne Systems', action: 'Debt/EBITDA ratio exceeded', time: '09:30 AM' }] },
                                { day: 8, status: 'compliant', events: [{ client: 'Acme Corp', action: 'All covenants met', time: '10:00 AM' }] },
                                { day: 9, status: 'compliant', events: [{ client: 'Multiple', action: 'Routine compliance checks', time: 'All day' }] },
                                { day: 10, status: 'compliant', events: [{ client: 'Stark Industries', action: 'New loan approved', time: '11:00 AM' }] },
                                { day: 11, status: 'warning', events: [{ client: 'Phoenix Group', action: 'CapEx limit approaching', time: '02:00 PM' }] },
                                { day: 12, status: 'compliant', events: [{ client: 'Atlas Mining', action: 'Restructuring finalized', time: '04:30 PM' }] },
                                { day: 13, status: 'compliant', events: [] },
                                { day: 14, status: 'compliant', events: [{ client: 'Multiple', action: 'Weekly audit complete', time: '05:00 PM' }] },
                                { day: 15, status: 'compliant', events: [{ client: 'Globex Industries', action: 'Payment received', time: '09:00 AM' }] },
                                { day: 16, status: 'compliant', events: [{ client: 'Wayne Enterprises', action: 'Document submitted', time: '10:30 AM' }] },
                                { day: 17, status: 'warning', events: [{ client: 'Delta Transport', action: 'Current ratio warning', time: '01:00 PM' }] },
                                { day: 18, status: 'compliant', events: [{ client: 'Apex Holdings', action: 'Amendment signed', time: '03:00 PM' }] },
                                { day: 19, status: 'compliant', events: [{ client: 'Multiple', action: 'Mid-month review', time: 'All day' }] },
                                { day: 20, status: 'breach', events: [{ client: 'Omega Energy', action: 'Missed covenant deadline', time: '11:59 PM' }] },
                                { day: 21, status: 'compliant', events: [] },
                                { day: 22, status: 'compliant', events: [{ client: 'Stark Industries', action: 'Quarterly payment', time: '09:00 AM' }] },
                                { day: 23, status: 'compliant', events: [{ client: 'Acme Corp', action: 'Compliance review', time: '02:00 PM' }] },
                                { day: 24, status: 'compliant', events: [{ client: 'Multiple', action: 'Holiday - No events', time: '-' }] },
                                { day: 25, status: 'compliant', events: [] },
                                { day: 26, status: 'warning', events: [{ client: 'Initech', action: 'Payment due soon', time: '09:00 AM' }] },
                                { day: 27, status: 'compliant', events: [{ client: 'Globex Industries', action: 'New issuance closed', time: '04:00 PM' }] },
                                { day: 28, status: 'compliant', events: [{ client: 'Multiple', action: 'Month-end processing', time: 'All day' }] },
                            ];

                            const colors = {
                                compliant: 'bg-emerald-500/60 hover:bg-emerald-500 hover:ring-2 hover:ring-emerald-400',
                                warning: 'bg-amber-500/60 hover:bg-amber-500 hover:ring-2 hover:ring-amber-400',
                                breach: 'bg-red-500/60 hover:bg-red-500 hover:ring-2 hover:ring-red-400'
                            };

                            return heatmapEvents.map((dayData) => (
                                <div
                                    key={dayData.day}
                                    onClick={() => setSelectedHeatmapDay(dayData)}
                                    className={`aspect-square rounded-md ${colors[dayData.status]} transition-all cursor-pointer flex items-center justify-center`}
                                >
                                    <span className="text-xs font-medium text-white/80">{dayData.day}</span>
                                </div>
                            ));
                        })()}
                    </div>
                    <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-slate-400">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded bg-emerald-500" />
                            <span>Compliant</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded bg-amber-500" />
                            <span>Warning</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded bg-red-500" />
                            <span>Breach</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-2">Click on a day to view events</p>
                </div>

                {/* Recent Events Feed */}
                <div className="bg-slate-850 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Events</h2>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                        {[
                            { time: '2 min ago', event: 'Covenant check passed', client: 'Stark Industries', type: 'success' },
                            { time: '15 min ago', event: 'New document uploaded', client: 'Acme Corp', type: 'info' },
                            { time: '1 hour ago', event: 'Deadline approaching', client: 'Globex Industries', type: 'warning' },
                            { time: '2 hours ago', event: 'Restructuring approved', client: 'Wayne Enterprises', type: 'success' },
                            { time: '3 hours ago', event: 'Covenant breach detected', client: 'Umbrella Corp', type: 'error' },
                            { time: '5 hours ago', event: 'New loan created', client: 'Initech Solutions', type: 'info' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${item.type === 'success' ? 'bg-emerald-400' :
                                    item.type === 'warning' ? 'bg-amber-400' :
                                        item.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{item.event}</p>
                                    <p className="text-xs text-slate-500">{item.client} • {item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Heatmap Day Modal */}
            {selectedHeatmapDay && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedHeatmapDay(null)}>
                    <div className="bg-slate-850 rounded-2xl border border-slate-700 max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">December {selectedHeatmapDay.day}, 2024</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedHeatmapDay.status === 'compliant' ? 'bg-emerald-500/20 text-emerald-400' :
                                selectedHeatmapDay.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                {selectedHeatmapDay.status.charAt(0).toUpperCase() + selectedHeatmapDay.status.slice(1)}
                            </span>
                        </div>
                        {selectedHeatmapDay.events.length > 0 ? (
                            <div className="space-y-3">
                                {selectedHeatmapDay.events.map((event, i) => (
                                    <div key={i} className="p-3 bg-slate-900 rounded-lg">
                                        <p className="font-medium text-white">{event.action}</p>
                                        <p className="text-sm text-slate-400">{event.client} • {event.time}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-center py-4">No events scheduled for this day</p>
                        )}
                        <button
                            onClick={() => setSelectedHeatmapDay(null)}
                            className="w-full mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Main Table */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Active Corporate Actions</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500">{data.length} total records</span>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                        >
                            <Plus size={18} />
                            <span>Add Event</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Loan ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Exposure</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Progress</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Deadline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {data.map((row) => (
                                <tr key={row.id} onClick={() => setSelectedAction(row)} className="hover:bg-slate-800/50 cursor-pointer transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-mono text-primary-400">{row.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                {row.client.charAt(0)}
                                            </div>
                                            <span className="text-sm text-white font-medium">{row.client}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{row.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <span className="text-sm font-semibold text-emerald-400">{formatNumber(row.amount)}</span>
                                            <p className="text-xs text-slate-500">{formatNumberWords(row.amount)}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap w-32">
                                        <div className="flex items-center space-x-2">
                                            <ProgressBar value={row.progress} />
                                            <span className="text-xs text-slate-400">{row.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                                            <Clock size={14} />
                                            <span>{row.deadline}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedAction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAction(null)}>
                    <div className="bg-slate-850 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedAction.client}</h3>
                                <p className="text-sm text-slate-400 font-mono">{selectedAction.id}</p>
                            </div>
                            <button onClick={() => setSelectedAction(null)} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Action Type</p>
                                    <p className="text-lg font-medium text-white mt-1">{selectedAction.type}</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Exposure</p>
                                    <p className="text-lg font-medium text-emerald-400 mt-1">{formatNumber(selectedAction.amount)}</p>
                                    <p className="text-xs text-slate-500">{formatNumberWords(selectedAction.amount)}</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Status</p>
                                    <div className="mt-2"><StatusBadge status={selectedAction.status} /></div>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Deadline</p>
                                    <p className="text-lg font-medium text-white mt-1 flex items-center space-x-2">
                                        <Clock size={16} className="text-slate-400" />
                                        <span>{selectedAction.deadline}</span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase mb-2">Progress</p>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1"><ProgressBar value={selectedAction.progress} /></div>
                                    <span className="text-white font-bold">{selectedAction.progress}%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase mb-2">Notes</p>
                                <p className="text-slate-300 bg-slate-900 p-4 rounded-lg">{selectedAction.notes || 'No notes.'}</p>
                            </div>

                            {deleteConfirm === selectedAction.id ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-400 mb-3">Delete this action permanently?</p>
                                    <div className="flex space-x-3">
                                        <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-slate-400">Cancel</button>
                                        <button onClick={() => handleDeleteAction(selectedAction.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-end pt-4 border-t border-slate-700">
                                    <button onClick={() => setDeleteConfirm(selectedAction.id)} className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                                        <Trash2 size={16} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Event Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
                    <div className="bg-slate-850 rounded-2xl border border-slate-700 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Add New Corporate Action</h3>
                            <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Client Name *</label>
                                <input type="text" value={newAction.client} onChange={e => setNewAction({ ...newAction, client: e.target.value })} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Enter client name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Type</label>
                                    <select value={newAction.type} onChange={e => setNewAction({ ...newAction, type: e.target.value })} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
                                        <option>Restructuring</option>
                                        <option>New Issuance</option>
                                        <option>Covenant Check</option>
                                        <option>Audit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Status</label>
                                    <select value={newAction.status} onChange={e => setNewAction({ ...newAction, status: e.target.value })} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
                                        <option>Active</option>
                                        <option>Critical</option>
                                        <option>Compliant</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Amount *</label>
                                    <input type="text" value={newAction.amount} onChange={e => setNewAction({ ...newAction, amount: e.target.value })} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" placeholder="150000000" />
                                    {newAction.amount && (
                                        <p className="text-xs text-emerald-400 mt-1">{formatNumber(parseFloat(newAction.amount.replace(/[$,]/g, '')) || 0)}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Deadline *</label>
                                    <input type="date" value={newAction.deadline} onChange={e => setNewAction({ ...newAction, deadline: e.target.value })} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Notes</label>
                                <textarea value={newAction.notes} onChange={e => setNewAction({ ...newAction, notes: e.target.value })} rows={3} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white resize-none" placeholder="Add notes..." />
                            </div>
                            <button onClick={handleAddAction} disabled={!newAction.client || !newAction.amount || !newAction.deadline} className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center space-x-2">
                                <Plus size={18} />
                                <span>Add Corporate Action</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
