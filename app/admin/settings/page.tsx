import { getConfig } from '@/lib/actions/config';
import { ConfigForm } from '@/components/config-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export default async function SettingsPage() {
  const config = await getConfig();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <Link href="/admin/settings/tech-stacks">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage Tech Stacks
          </Button>
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <ConfigForm initialData={config} />
      </div>
    </div>
  );
}