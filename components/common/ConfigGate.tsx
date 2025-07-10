import React from 'react';
import { supabaseUrl, supabaseAnonKey } from '../../supabase/supabase';

interface ConfigGateProps {
    children: React.ReactNode;
}

const isConfigured = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export const ConfigGate: React.FC<ConfigGateProps> = ({ children }) => {
    if (isConfigured) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 bg-primary text-white flex flex-col justify-center items-center p-8 z-[100]">
            <div className="max-w-3xl w-full text-center bg-secondary p-10 rounded-lg border border-hotpink shadow-2xl">
                <h1 className="text-4xl font-heading text-hotpink mb-4">Configuration Required</h1>
                <p className="text-lg mb-6 text-gray-300">
                    Welcome! To activate your site, please connect it to your Supabase database.
                </p>
                <div className="text-left bg-primary p-6 rounded-lg font-mono text-sm space-y-4">
                    <p><strong className="text-accent">Step 1:</strong> Open the file <code className="bg-gray-700 px-2 py-1 rounded">supabase/supabase.ts</code> in your code editor.</p>
                    <p><strong className="text-accent">Step 2:</strong> Replace the placeholder values for <code className="bg-gray-700 px-2 py-1 rounded">supabaseUrl</code> and <code className="bg-gray-700 px-2 py-1 rounded">supabaseAnonKey</code> with your actual credentials from your Supabase project dashboard.</p>
                    <p className="text-gray-400 pt-2">
                        If you haven't set up your Supabase project yet, please follow the complete step-by-step guide in the project's <code className="bg-gray-700 px-2 py-1 rounded">README.md</code> file.
                    </p>
                </div>
            </div>
        </div>
    );
};
