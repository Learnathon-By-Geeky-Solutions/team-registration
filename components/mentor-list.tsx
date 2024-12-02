'use client'

import { useState } from 'react';
import { deleteMentor } from '@/lib/actions/mentor';
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
import { Trash2, ExternalLink, Pencil } from 'lucide-react';
import Link from 'next/link';

interface Mentor {
  id: number;
  full_name: string;
  tech_stack: string;
  github_username: string;
  linkedin_url: string | null;
  max_team_capacity: number;
}

interface MentorListProps {
  mentors: Mentor[];
  onMentorDeleted?: () => void;
}

export function MentorList({ mentors: initialMentors, onMentorDeleted }: MentorListProps) {
  const [mentors, setMentors] = useState(initialMentors);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const result = await deleteMentor(id);
      if (result.success) {
        setMentors(mentors.filter(mentor => mentor.id !== id));
        toast.success('Mentor deleted successfully');
        onMentorDeleted?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete mentor');
    } finally {
      setDeletingId(null);
    }
  };

  if (mentors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No mentors found. Add some mentors to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Tech Stack</TableHead>
            <TableHead>GitHub</TableHead>
            <TableHead>Team Capacity</TableHead>
            <TableHead>Links</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors.map((mentor) => (
            <TableRow key={mentor.id}>
              <TableCell className="font-medium">{mentor.full_name}</TableCell>
              <TableCell>{mentor.tech_stack}</TableCell>
              <TableCell>{mentor.github_username}</TableCell>
              <TableCell>{mentor.max_team_capacity}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <a
                    href={`https://github.com/${mentor.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  {mentor.linkedin_url && (
                    <a
                      href={mentor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Link href={`/admin/mentors/${mentor.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="inline-flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(mentor.id)}
                    disabled={deletingId === mentor.id}
                    className="inline-flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === mentor.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}