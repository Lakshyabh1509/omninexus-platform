import React, { useState, useCallback } from 'react';
import {
    Upload, FileText, Database, Globe, CheckCircle, XCircle, Clock,
    RefreshCw, Trash2, Plus, Server, CloudLightning, ArrowUpRight,
    FileSpreadsheet, File, AlertCircle
} from 'lucide-react';
import { getStoredData, setStoredData, DATA_KEYS } from '../lib/utils';

const apiConnections = [
    { id: 1, name: 'Bloomberg Terminal', status: 'connected', lastSync: '2 min ago', dataPoints: '1.2M' },
    { id: 2, name: 'Reuters Eikon', status: 'connected', lastSync: '5 min ago', dataPoints: '890K' },
    { id: 3, name: 'S&P Capital IQ', status: 'warning', lastSync: '1 hour ago', dataPoints: '450K' },
    { id: 4, name: 'Moody\'s Analytics', status: 'connected', lastSync: '15 min ago', dataPoints: '320K' },
    { id: 5, name: 'ICE Data Services', status: 'disconnected', lastSync: 'Never', dataPoints: '0' },
    { id: 6, name: 'Markit iBoxx', status: 'connected', lastSync: '30 min ago', dataPoints: '180K' },
];

const fileTypes = [
    { ext: 'xlsx', icon: FileSpreadsheet, color: 'text-emerald-400' },
    { ext: 'csv', icon: FileText, color: 'text-blue-400' },
    { ext: 'pdf', icon: File, color: 'text-red-400' },
    { ext: 'json', icon: FileText, color: 'text-amber-400' },
];

export default function DataIngestion() {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([
        { id: 1, name: 'Q3_2024_Financials.xlsx', size: '2.4 MB', status: 'processed', date: '2024-12-01' },
        { id: 2, name: 'Covenant_Compliance_Report.pdf', size: '1.1 MB', status: 'processed', date: '2024-11-28' },
        { id: 3, name: 'Borrowing_Base_Certificate.csv', size: '456 KB', status: 'processing', date: '2024-12-03' },
    ]);
    const [syntheticCount, setSyntheticCount] = useState(() => {
        const actions = getStoredData(DATA_KEYS.CORPORATE_ACTIONS, []);
        return actions.filter(a => a.isSynthetic).length;
    });

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const newFile = {
                id: Date.now(),
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                status: 'processing',
                date: new Date().toISOString().split('T')[0]
            };
            setUploadedFiles(prev => [newFile, ...prev]);

            // Simulate processing
            setTimeout(() => {
                setUploadedFiles(prev => prev.map(f =>
                    f.id === newFile.id ? { ...f, status: 'processed' } : f
                ));
            }, 3000);
        }
    }, []);

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newFile = {
                id: Date.now(),
                name: file.name,
                size: (file.size / 1024).toFixed(0) + ' KB',
                status: 'processing',
                date: new Date().toISOString().split('T')[0]
            };
            setUploadedFiles(prev => [newFile, ...prev]);

            setTimeout(() => {
                setUploadedFiles(prev => prev.map(f =>
                    f.id === newFile.id ? { ...f, status: 'processed' } : f
                ));
            }, 3000);
        }
    };

    const addSyntheticData = () => {
        const syntheticActions = [
            { id: Date.now(), company: 'Demo Corp', type: 'Merger', amount: 500000000, status: 'Pending', isSynthetic: true },
            { id: Date.now() + 1, company: 'Test Industries', type: 'Acquisition', amount: 250000000, status: 'Approved', isSynthetic: true },
            { id: Date.now() + 2, company: 'Sample Holdings', type: 'Dividend', amount: 50000000, status: 'Complete', isSynthetic: true },
        ];
        const existing = getStoredData(DATA_KEYS.CORPORATE_ACTIONS, []);
        setStoredData(DATA_KEYS.CORPORATE_ACTIONS, [...syntheticActions, ...existing]);
        setSyntheticCount(prev => prev + 3);
    };

    const removeSyntheticData = () => {
        const existing = getStoredData(DATA_KEYS.CORPORATE_ACTIONS, []);
        const filtered = existing.filter(a => !a.isSynthetic);
        setStoredData(DATA_KEYS.CORPORATE_ACTIONS, filtered);
        setSyntheticCount(0);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'connected': return <CheckCircle size={18} className="text-emerald-400" />;
            case 'warning': return <AlertCircle size={18} className="text-amber-400" />;
            case 'disconnected': return <XCircle size={18} className="text-red-400" />;
            default: return <Clock size={18} className="text-slate-400" />;
        }
    };

    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        const fileType = fileTypes.find(f => f.ext === ext);
        if (fileType) {
            const Icon = fileType.icon;
            return <Icon size={20} className={fileType.color} />;
        }
        return <File size={20} className="text-slate-400" />;
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">API Connections</p>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                {apiConnections.filter(a => a.status === 'connected').length}/{apiConnections.length}
                            </h3>
                        </div>
                        <Globe className="text-blue-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Files Uploaded</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{uploadedFiles.length}</h3>
                        </div>
                        <Upload className="text-emerald-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Data Points</p>
                            <h3 className="text-2xl font-bold text-purple-400 mt-1">3.04M</h3>
                        </div>
                        <Database className="text-purple-400" size={24} />
                    </div>
                </div>
                <div className="bg-slate-850 p-6 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Synthetic Records</p>
                            <h3 className="text-2xl font-bold text-amber-400 mt-1">{syntheticCount}</h3>
                        </div>
                        <Server className="text-amber-400" size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* File Upload Dropzone */}
                <div className="bg-slate-850 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Document Upload</h2>
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                            }`}
                    >
                        <input
                            type="file"
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".xlsx,.csv,.pdf,.json"
                        />
                        <CloudLightning size={48} className={`mx-auto mb-4 ${dragActive ? 'text-primary-400' : 'text-slate-500'}`} />
                        <h3 className="text-lg font-medium text-white mb-2">
                            {dragActive ? 'Drop files here' : 'Drag & drop files'}
                        </h3>
                        <p className="text-sm text-slate-400">
                            or click to browse • Supports XLSX, CSV, PDF, JSON
                        </p>
                    </div>

                    {/* Uploaded Files List */}
                    <div className="mt-6 space-y-3">
                        {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    {getFileIcon(file.name)}
                                    <div>
                                        <p className="text-sm font-medium text-white">{file.name}</p>
                                        <p className="text-xs text-slate-500">{file.size} • {file.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {file.status === 'processing' ? (
                                        <RefreshCw size={16} className="text-amber-400 animate-spin" />
                                    ) : (
                                        <CheckCircle size={16} className="text-emerald-400" />
                                    )}
                                    <span className="text-xs capitalize text-slate-400">{file.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Synthetic Data Manager */}
                <div className="bg-slate-850 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Synthetic Data Manager</h2>
                    <p className="text-sm text-slate-400 mb-6">
                        Add or remove demo data for testing and demonstration purposes.
                        Synthetic data is clearly marked and can be removed at any time.
                    </p>

                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={addSyntheticData}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                        >
                            <Plus size={18} />
                            <span>Add Demo Data</span>
                        </button>
                        <button
                            onClick={removeSyntheticData}
                            disabled={syntheticCount === 0}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                            <span>Remove All</span>
                        </button>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Active Synthetic Records</span>
                            <span className="text-2xl font-bold text-white">{syntheticCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* API Connections */}
            <div className="bg-slate-850 rounded-xl border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">API Connections</h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                        <RefreshCw size={16} />
                        <span>Sync All</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {apiConnections.map((api) => (
                        <div key={api.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    {getStatusIcon(api.status)}
                                    <h3 className="font-medium text-white">{api.name}</h3>
                                </div>
                                <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                                    <ArrowUpRight size={14} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Last sync: {api.lastSync}</span>
                                <span className="text-slate-400">{api.dataPoints} points</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
