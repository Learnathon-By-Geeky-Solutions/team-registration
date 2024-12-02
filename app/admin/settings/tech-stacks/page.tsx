'use client'

import { useState, useEffect } from 'react';
import { getTechStacks, addTechStack, deleteTechStack } from '@/lib/actions/tech-stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { TechStackList } from '@/components/tech-stack-list';
import { Plus } from 'lucide-react';

export default function TechStacksPage() {
  const [stacks, setStacks] = useState<string[]>([]);
  const [newStack, setNewStack] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const loadStacks = async () => {
    try {
      const data = await getTechStacks();
      setStacks(data);
    } catch (error) {
      toast.error('Failed to load technology stacks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStack.trim()) return;

    setIsAdding(true);
    try {
      const result = await addTechStack(newStack.trim());
      if (result.success) {
        toast.success('Technology stack added successfully');
        setNewStack('');
        loadStacks();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to add technology stack');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return <div>Loading technology stacks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Technology Stacks</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <Input
          value={newStack}
          onChange={(e) => setNewStack(e.target.value)}
          placeholder="Enter new technology stack"
          className="max-w-md"
        />
        <Button type="submit" disabled={isAdding || !newStack.trim()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {isAdding ? 'Adding...' : 'Add Stack'}
        </Button>
      </form>

      <TechStackList stacks={stacks} onStackDeleted={loadStacks} />
    </div>
  );
}