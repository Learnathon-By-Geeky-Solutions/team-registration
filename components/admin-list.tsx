'use client'

import { useState } from 'react';
import { deleteAdmin } from '@/lib/actions/admin';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface Admin {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

interface AdminListProps {
  admins: Admin[];
  onAdminDeleted?: () => void;
}

export function AdminList({ admins: initialAdmins, onAdminDeleted }: AdminListProps) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const result = await deleteAdmin(id);
      if (result.success) {
        setAdmins(admins.filter(admin => admin.id !== id));
        toast.success('Administrator removed successfully');
        onAdminDeleted?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to remove administrator');
    } finally {
      setDeletingId(null);
    }
  };

  if (admins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No administrators found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-medium">{admin.name}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                {admin.email}
              </TableCell>
              <TableCell>
                {format(new Date(admin.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(admin.id)}
                  disabled={deletingId === admin.id}
                  className="inline-flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === admin.id ? 'Removing...' : 'Remove'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}