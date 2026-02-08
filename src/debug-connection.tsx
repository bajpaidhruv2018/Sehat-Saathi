
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCcw, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DebugConnection() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [envInfo, setEnvInfo] = useState<string>('');

    useEffect(() => {
        checkEnv();
    }, []);

    const checkEnv = () => {
        const url = import.meta.env.VITE_SUPABASE_URL || 'Using default/missing';
        // Hide part of the key for security if displaying
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Present' : 'Missing';
        setEnvInfo(`URL: ${url}, Key: ${key}`);
    };

    const testConnection = async () => {
        setLoading(true);
        const newResults = [];

        // Test 1: doctor_questions
        try {
            const { data, error } = await supabase
                .from('doctor_questions')
                .select('*', { count: 'exact', head: true });

            newResults.push({
                name: 'doctor_questions',
                success: !error,
                message: error ? error.message : `Success! Found table with ${data ? 'available' : 0} rows (head check).`,
                details: error || data
            });
        } catch (e: any) {
            newResults.push({ name: 'doctor_questions', success: false, message: e.message, details: e });
        }

        // Test 2: health_forum
        try {
            const { data, error } = await (supabase as any)
                .from('health_forum')
                .select('*', { count: 'exact', head: true });

            newResults.push({
                name: 'health_forum',
                success: !error,
                message: error ? error.message : `Success! Found table with ${data ? 'available' : 0} rows (head check).`,
                details: error || data
            });
        } catch (e: any) {
            newResults.push({ name: 'health_forum', success: false, message: e.message, details: e });
        }

        setResults(newResults);
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-6 w-6" />
                        Supabase Connection Diagnostic
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-md font-mono text-sm">
                        {envInfo}
                    </div>

                    <Button onClick={testConnection} disabled={loading} className="w-full">
                        {loading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : 'Run Diagnostics'}
                    </Button>

                    <div className="space-y-4 mt-6">
                        {results.map((res, idx) => (
                            <Alert key={idx} variant={res.success ? "default" : "destructive"}>
                                {res.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertTitle className="font-bold capitalize">{res.name}</AlertTitle>
                                <AlertDescription>
                                    <p className="mt-1 font-medium">{res.message}</p>
                                    {res.details && !res.success && (
                                        <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-x-auto">
                                            {JSON.stringify(res.details, null, 2)}
                                        </pre>
                                    )}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
