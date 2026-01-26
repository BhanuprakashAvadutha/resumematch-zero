import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let connectionStatus = "UNTESTED";
    let authError = null;
    let user = null;

    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            connectionStatus = "CONNECTION FAILED";
            authError = error.message;
        } else {
            connectionStatus = "CONNECTED ✅";
            user = data.user ? `Logged in as: ${data.user.email}` : "No active session (but connected)";
        }
    } catch (e: any) {
        connectionStatus = "CRITICAL FAILURE";
        authError = e.message;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <h1 className="text-2xl text-red-500 font-bold mb-6">🕵️ SERVER-SIDE DEBUGGER</h1>

            <div className="space-y-6">
                <div className="p-4 border border-gray-800 rounded">
                    <h2 className="text-blue-400 font-bold mb-2">1. Environment Variables</h2>
                    <div className="grid grid-cols-[200px_1fr] gap-2 text-sm">
                        <div>NEXT_PUBLIC_SUPABASE_URL:</div>
                        <div className={supabaseUrl ? "text-green-400" : "text-red-500"}>
                            {supabaseUrl ? `✅ Defined (${supabaseUrl.substring(0, 15)}...)` : "❌ MISSING"}
                        </div>

                        <div>NEXT_PUBLIC_SUPABASE_ANON_KEY:</div>
                        <div className={supabaseKey ? "text-green-400" : "text-red-500"}>
                            {supabaseKey ? `✅ Defined (${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)})` : "❌ MISSING"}
                        </div>
                    </div>
                </div>

                <div className="p-4 border border-gray-800 rounded">
                    <h2 className="text-purple-400 font-bold mb-2">2. Supabase Connection</h2>
                    <div className="text-xl font-bold mb-2">{connectionStatus}</div>
                    {authError && <div className="text-red-400 bg-red-900/20 p-2 rounded">Error: {authError}</div>}
                    {user && <div className="text-green-400 bg-green-900/20 p-2 rounded">{user}</div>}
                </div>
            </div>
        </div>
    );
}
