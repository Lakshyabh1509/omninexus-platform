import React, { useState, useEffect } from 'react';
import {
    Database, TrendingUp, Filter, Plus, Edit2, Trash2, X, Save,
    DollarSign, FileText, BarChart2, Calendar, Tag, AlertTriangle, Check
} from 'lucide-react';
import { formatNumber, formatNumberWords, getStoredData, setStoredData, DATA_KEYS } from '../lib/utils';

const categories = [
    { id: 'financial', name: 'Financial', color: 'blue' },
    { id: 'operational', name: 'Operational', color: 'purple' },
    { id: 'analytics', name: 'Analytics', color: 'emerald' },
    { id: 'marketing', name: 'Marketing', color: 'pink' },
    { id: 'hr', name: 'HR', color: 'amber' },
    { id: 'compliance', name: 'Compliance', color: 'red' },
];

const defaultEntries = [
    { id: 1, title: 'Q4 Revenue Projection', description: 'Quarterly revenue forecast based on current trends', category: 'financial', value: 2450000000, status: 'active', createdAt: new Date().toISOString() },
    { id: 2, title: 'Annual Operating Costs', description: 'Total operational expenditure for FY2024', category: 'operational', value: 185000000, status: 'active', createdAt: new Date().toISOString() },
    { id: 3, title: 'Customer Acquisition Cost', description: 'Average CAC across all channels', category: 'marketing', value: 2500, status: 'active', createdAt: new Date().toISOString() },
    { id: 4, title: 'Employee Count', description: 'Total headcount across all departments', category: 'hr', value: 1247, status: 'active', createdAt: new Date().toISOString() },
    { id: 5, title: 'Market Cap Valuation', description: 'Current market capitalization estimate', category: 'analytics', value: 15800000000, status: 'active', createdAt: new Date().toISOString() },
];

export default function DataFabric() {
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [formData, setFormData] = useState({
        title: '', description: '', category: 'financial', value: '', status: 'active'
    });

    useEffect(() => {
        const stored = getStoredData(DATA_KEYS.DATA_ENTRIES, []);
        if (stored.length === 0) {
            setEntries(defaultEntries);
            setStoredData(DATA_KEYS.DATA_ENTRIES, defaultEntries);
        } else {
            setEntries(stored);
        }
    }, []);

    const saveEntries = (newEntries) => {
        setEntries(newEntries);
        setStoredData(DATA_KEYS.DATA_ENTRIES, newEntries);
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.value) return;

        const entry = {
            ...formData,
            value: parseFloat(formData.value),
            id: editingEntry?.id || Date.now(),
            createdAt: editingEntry?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (editingEntry) {
            saveEntries(entries.map(e => e.id === editingEntry.id ? entry : e));
        } else {
            saveEntries([entry, ...entries]);
        }

        resetForm();
    };

    const handleDelete = (id) => {
        saveEntries(entries.filter(e => e.id !== id));
        setDeleteConfirm(null);
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', category: 'financial', value: '', status: 'active' });
        setShowForm(false);
        setEditingEntry(null);
    };

    const startEdit = (entry) => {
        setFormData({
            title: entry.title,
            description: entry.description || '',
            category: entry.category,
            value: entry.value.toString(),
            status: entry.status
        });
        setEditingEntry(entry);
        setShowForm(true);
    };

    const filteredEntries = filterCategory === 'all'
        ? entries
        : entries.filter(e => e.category === filterCategory);

    const stats = {
        total: entries.length,
        totalValue: entries.reduce((sum, e) => sum + (e.value || 0), 0),
        byCategory: categories.map(cat => ({
            ...cat,
            count: entries.filter(e => e.category === cat.id).length
        }))
    };

    const getCategoryColor = (catId) => {
        return categories.find(c => c.id === catId)?.color || 'slate';
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Entries</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
                        </div>
                        <Database className="text-blue-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Value</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{formatNumber(stats.totalValue)}</h3>
                            <p className="text-xs text-slate-500 mt-1">{formatNumberWords(stats.totalValue)}</p>
                        </div>
                        <DollarSign className="text-emerald-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Categories Used</p>
                            <h3 className="text-2xl font-bold text-purple-400 mt-1">
                                {stats.byCategory.filter(c => c.count > 0).length}
                            </h3>
                        </div>
                        <Tag className="text-purple-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Avg Value</p>
                            <h3 className="text-2xl font-bold text-amber-400 mt-1">
                                {formatNumber(stats.total > 0 ? stats.totalValue / stats.total : 0)}
                            </h3>
                        </div>
                        <BarChart2 className="text-amber-400" size={24} />
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Entry</span>
                    </button>
                </div>
            </div>

            {/* Entries List */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-white">Data Entries</h2>
                </div>
                <div className="divide-y divide-slate-800">
                    {filteredEntries.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No entries found. Add your first data entry!
                        </div>
                    ) : (
                        filteredEntries.map((entry) => (
                            <div key={entry.id} className="p-6 hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h4 className="text-lg font-medium text-white">{entry.title}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full bg-${getCategoryColor(entry.category)}-500/10 text-${getCategoryColor(entry.category)}-400 border border-${getCategoryColor(entry.category)}-500/20`}>
                                                {categories.find(c => c.id === entry.category)?.name || entry.category}
                                            </span>
                                        </div>
                                        {entry.description && (
                                            <p className="text-slate-400 text-sm mb-3">{entry.description}</p>
                                        )}
                                        <div className="flex items-center space-x-6 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign size={16} className="text-emerald-400" />
                                                <span className="font-semibold text-emerald-400">{formatNumber(entry.value)}</span>
                                                <span className="text-slate-500">({formatNumberWords(entry.value)})</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-slate-500">
                                                <Calendar size={14} />
                                                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => startEdit(entry)}
                                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(entry.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Delete Confirmation */}
                                {deleteConfirm === entry.id && (
                                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-red-400">
                                                <AlertTriangle size={18} />
                                                <span>Delete this entry permanently?</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="px-3 py-1 text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(entry.id)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={resetForm}>
                    <div className="bg-slate-850 rounded-2xl border border-slate-700 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {editingEntry ? 'Edit Entry' : 'Add New Entry'}
                            </h3>
                            <button onClick={resetForm} className="p-2 hover:bg-slate-700 rounded-lg">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="Enter title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                    placeholder="Add description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Value *</label>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={e => setFormData({ ...formData, value: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="Enter value"
                                    />
                                </div>
                            </div>
                            {formData.value && (
                                <div className="p-3 bg-slate-900 rounded-lg">
                                    <p className="text-sm text-slate-400">Preview: <span className="text-emerald-400 font-medium">{formatNumber(parseFloat(formData.value) || 0)}</span></p>
                                    <p className="text-xs text-slate-500">{formatNumberWords(parseFloat(formData.value) || 0)}</p>
                                </div>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.title || !formData.value}
                                className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                <Save size={18} />
                                <span>{editingEntry ? 'Update Entry' : 'Add Entry'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
