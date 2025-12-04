import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        // Check for demo mode first
        const demoMode = localStorage.getItem('omninexus_demo_mode');
        if (demoMode === 'true') {
            const demoUser = JSON.parse(localStorage.getItem('omninexus_demo_user') || '{}');
            setUser(demoUser);
            setIsDemoMode(true);
            setLoading(false);
            return;
        }

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    };

    const signOut = async () => {
        // Clear demo mode if active
        if (isDemoMode) {
            localStorage.removeItem('omninexus_demo_mode');
            localStorage.removeItem('omninexus_demo_user');
            setIsDemoMode(false);
            setUser(null);
            return { error: null };
        }

        const { error } = await supabase.auth.signOut();
        return { error };
    };

    return (
        <AuthContext.Provider value={{ user, loading, isDemoMode, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
