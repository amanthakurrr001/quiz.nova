// This is a placeholder file for the dashboard page.
// The full implementation will be provided in a future update.

import { ApiKeyManager } from '@/components/dashboard/ApiKeyManager';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p>Welcome to your QuizGenius dashboard. More features coming soon!</p>
            <ApiKeyManager />
        </div>
    );
}