'use client'

import { useState } from 'react';
import { deleteTechStack } from '@/lib/actions/tech-stack';
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
import { Trash2 } from 'lucide-react';

interface TechStackListProps {
  stacks: string[];
  onStackDeleted?: () => void;
}

export function TechStackList({ stacks, onStackDeleted }: TechStackListProps) {
  const [deletingStack, setDeletingStack] = useState<string | null>(null);

  const handleDelete = async (stack: string) => {
    setDeletingStack(stack);
    try {
      const result = await deleteTechStack(stack);
      if (result.success) {
        toast.success('Technology stack removed successfully');
        onStackDeleted?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to remove technology stack');
    } finally {
      setDeletingStack(null);
    }
  };

  if (stacks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No technology stacks found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stack Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stacks.map((stack) => (
            <TableRow key={stack}>
              <TableCell className="font-medium">{stack}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(stack)}
                  disabled={deletingStack === stack}
                  className="inline-flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingStack === stack ? 'Removing...' : 'Remove'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}