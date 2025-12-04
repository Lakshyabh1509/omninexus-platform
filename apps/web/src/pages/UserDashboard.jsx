import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, TrendingUp, Database, Trash2, AlertTriangle, Plus, ArrowLeft, X } from 'lucide-react';

const DEMO_SYNTHETIC_DATA = [
    { id: 1, title: 'Q4 2024 Revenue', category: 'Financial', description: 'Quarterly revenue projections', data_value: 2450000, is_synthetic: true, created_at: new Date().toISOString() },
    { id: 2, title: 'Employee Headcount', category: 'HR', description: 'Current employee statistics', data_value: 127, is_synthetic: true, created_at: new Date().toISOString() },
    { id: 3, title: 'Marketing ROI', category: 'Marketing', description: 'Campaign return on investment', data_value: 3.2, is_synthetic: true, created_at: new Date().toISOString() },
    { id: 4, title: 'Server Uptime', category: 'Operational', description: 'System availability percentage', data_value: 99.8, is_synthetic: true, created_at: new Date().toISOString() },
    { id: 5, title: 'Customer Satisfaction', category: 'Analytics', description: 'NPS Score', data_value: 82, is_synthetic: true, created_at: new Date().toISOString() }
];

export default function UserDashboard() {
    const { user, isDemoMode, signOut } = useAuth();
    const [dataEntries, setDataEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const stored = localStorage.getItem('omninexus_demo_data');
        if (stored) {
            setDataEntries(JSON.parse(stored));
        }
        setLoading(false);
    };

    const saveData = (data) => {
        localStorage.setItem('omninexus_demo_data', JSON.stringify(data));
        setDataEntries(data);
    };

    const seedSyntheticData = () => {
        const existing = dataEntries.filter(e => !e.is_synthetic);
        const newData = [...existing, ...DEMO_SYNTHETIC_DATA];
        saveData(newData);
    };

    const removeSyntheticData = () => {
        const realData = dataEntries.filter(e => !e.is_synthetic);
        saveData(realData);
        setShowDeleteConfirm(false);
    };

    const handleSignOut = async () => {
        await signOut();
        window.location.href = '/auth';
    };

    const syntheticCount = dataEntries.filter(e => e.is_synthetic).length;
    const realCount = dataEntries.length - syntheticCount;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <User size={32} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user?.user_metadata?.full_name || 'Demo User'}</h1>
                                <p className="flex items-center space-x-2 text-white/80">
                                    <Mail size={16} />
                                    <span>{user?.email || 'demo@omninexus.com'}</span>
                                </p>
                                {isDemoMode && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                                        Demo Mode
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Total Entries</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{dataEntries.length}</h3>
                            </div>
                            <Database className="text-blue-400" size={24} />
                        </div>
                    </div>
                    <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Synthetic Data</p>
                                <h3 className="text-2xl font-bold text-purple-400 mt-1">{syntheticCount}</h3>
                            </div>
                            <TrendingUp className="text-purple-400" size={24} />
                        </div>
                    </div>
                    <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Real Data</p>
                                <h3 className="text-2xl font-bold text-emerald-400 mt-1">{realCount}</h3>
                            </div>
                            <AlertTriangle className="text-emerald-400" size={24} />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {syntheticCount === 0 ? (
                    <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                        <div className="text-center space-y-4">
                            <p className="text-slate-400">No synthetic data. Want to see how it works?</p>
                            <button
                                onClick={seedSyntheticData}
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                            >
                                <Plus size={18} />
                                <span>Add Synthetic Demo Data</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <AlertTriangle className="text-amber-500" />
                            <span className="text-amber-400">You have {syntheticCount} synthetic demo entries</span>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                            <span>Remove Synthetic Data</span>
                        </button>
                    </div>
                )}

                {/* Data List */}
                <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="text-lg font-semibold text-white">Your Data Entries</h3>
                    </div>
                    <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
                        {dataEntries.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No data entries yet. Add synthetic data to see demo!</div>
                        ) : (
                            dataEntries.map((entry) => (
                                <div key={entry.id} className="p-6 hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="text-lg font-medium text-white">{entry.title}</h4>
                                                <span className="px-2 py-1 text-xs bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20">
                                                    {entry.category}
                                                </span>
                                                {entry.is_synthetic && (
                                                    <span className="px-2 py-1 text-xs bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                                                        Demo
                                                    </span>
                                                )}
                                            </div>
                                            {entry.description && (
                                                <p className="text-slate-400 text-sm mb-2">{entry.description}</p>
                                            )}
                                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                {entry.data_value && (
                                                    <span className="font-medium text-emerald-400">
                                                        {typeof entry.data_value === 'number' && entry.data_value > 1000
                                                            ? `$${(entry.data_value / 1000000).toFixed(2)}M`
                                                            : entry.data_value}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-850 rounded-2xl border border-slate-700 max-w-md w-full p-6">
                        <div className="flex items-center space-x-3 text-red-400 mb-4">
                            <Trash2 size={24} />
                            <h3 className="text-xl font-bold">Remove Synthetic Data?</h3>
                        </div>
                        <p className="text-slate-400 mb-6">
                            This will remove all {syntheticCount} synthetic demo entries. Your real data will remain untouched.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={removeSyntheticData}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                            >
                                Remove All Synthetic Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
