'use client'

import { getMentors } from '@/lib/actions/mentor';
import { MentorList } from '@/components/mentor-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserPlus, Download, Upload } from 'lucide-react';
import { createMentorsFromCsv } from '@/lib/actions/mentor';
import { toast } from 'sonner';

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const loadMentors = async () => {
    try {
      const data = await getMentors();
      setMentors(data);
    } catch (error) {
      console.error('Failed to load mentors:', error);
      toast.error('Failed to load mentors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMentors();
  }, []);

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        const result = await createMentorsFromCsv(csv);
        if (result.success) {
          toast.success(`Successfully added ${result.count} mentors`);
          loadMentors(); // Refresh the list
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error('Failed to process CSV file');
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = 'Full Name,Tech Stack,GitHub Username,LinkedIn URL,Max Team Capacity\nJohn Doe,React,johndoe,https://linkedin.com/in/johndoe,3';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mentor-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div>Loading mentors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mentors</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Label
            htmlFor="csv-upload"
            className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
          >
            <Button variant="outline" disabled={isUploading} asChild>
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload CSV'}
              </span>
            </Button>
          </Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvUpload}
            disabled={isUploading}
          />
          <Link href="/admin/mentors/new">
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Mentor
            </Button>
          </Link>
        </div>
      </div>
      <MentorList mentors={mentors} onMentorDeleted={loadMentors} />
    </div>
  );
}