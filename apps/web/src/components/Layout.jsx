import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resetAllData } from '../lib/utils';
import {
    LayoutDashboard, ShieldCheck, Database, Bot, Menu, User, LogOut,
    BarChart, FileText, RefreshCcw, Settings, AlertTriangle, Briefcase, Upload
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
            ? 'bg-primary-600 text-white'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    const handleResetAllData = () => {
        resetAllData();
        setShowResetConfirm(false);
        window.location.reload();
    };

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Corporate Actions Command Center';
            case '/loans': return 'Loan Management';
            case '/compliance': return 'Compliance Sentinel';
            case '/data': return 'Data Fabric';
            case '/data-ingestion': return 'Data Ingestion';
            case '/reports': return 'Investment Banking Reports';
            case '/agents': return 'AI Support Assistant';
            default: return 'OmniNexus';
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-850 border-r border-slate-800 flex flex-col">
                <div className="p-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white text-xl">O</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">OmniNexus</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <SidebarItem
                        to="/"
                        icon={LayoutDashboard}
                        label="Command Center"
                        active={location.pathname === '/'}
                    />
                    <SidebarItem
                        to="/loans"
                        icon={Briefcase}
                        label="Loan Management"
                        active={location.pathname === '/loans'}
                    />
                    <SidebarItem
                        to="/compliance"
                        icon={ShieldCheck}
                        label="Compliance Sentinel"
                        active={location.pathname === '/compliance'}
                    />
                    <SidebarItem
                        to="/data"
                        icon={Database}
                        label="Data Fabric"
                        active={location.pathname === '/data'}
                    />
                    <SidebarItem
                        to="/data-ingestion"
                        icon={Upload}
                        label="Data Ingestion"
                        active={location.pathname === '/data-ingestion'}
                    />
                    <SidebarItem
                        to="/reports"
                        icon={FileText}
                        label="IB Reports"
                        active={location.pathname === '/reports'}
                    />
                    <SidebarItem
                        to="/agents"
                        icon={Bot}
                        label="AI Support"
                        active={location.pathname === '/agents'}
                    />
                </nav>

                {/* User Menu */}
                <div className="p-4 border-t border-slate-800 relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-3 w-full p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <User size={18} className="text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                            <p className="text-xs text-slate-500">Click for options</p>
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                            <Link
                                to="/dashboard"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition-colors text-slate-300"
                            >
                                <BarChart size={18} />
                                <span>My Dashboard</span>
                            </Link>
                            <button
                                onClick={() => { setShowUserMenu(false); setShowResetConfirm(true); }}
                                className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition-colors text-amber-400 w-full"
                            >
                                <RefreshCcw size={18} />
                                <span>Reset All Data</span>
                            </button>
                            <button
                                onClick={() => { setShowUserMenu(false); handleSignOut(); }}
                                className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition-colors text-red-400 w-full"
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-slate-850 border-b border-slate-800 flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
                    <button className="p-2 text-slate-400 hover:text-white">
                        <Menu size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-6 bg-slate-900">
                    <Outlet />
                </div>
            </main>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-850 rounded-2xl border border-slate-700 max-w-md w-full p-6">
                        <div className="flex items-center space-x-3 text-amber-400 mb-4">
                            <AlertTriangle size={24} />
                            <h3 className="text-xl font-bold">Reset All Data?</h3>
                        </div>
                        <p className="text-slate-400 mb-6">
                            This will permanently delete all data across Command Center, Compliance History,
                            Data Fabric entries, and generated Reports. This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetAllData}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                            >
                                Reset All Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
