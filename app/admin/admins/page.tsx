'use client'

import { useState, useEffect } from 'react';
import { getAdmins } from '@/lib/actions/admin';
import { AdminList } from '@/components/admin-list';
import { AdminForm } from '@/components/admin-form';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Admin {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data as Admin[]);
    } catch (error) {
      toast.error('Failed to load administrators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAdminAdded = () => {
    setIsDialogOpen(false);
    loadAdmins();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500">Loading administrators...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administrators</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Administrator</DialogTitle>
            </DialogHeader>
            <AdminForm onSuccess={handleAdminAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <AdminList 
        admins={admins} 
        onAdminDeleted={loadAdmins}
      />
    </div>
  );
}