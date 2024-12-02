'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMentor } from '@/lib/actions/mentor';
import { getTechStacks } from '@/lib/actions/team';
import { MentorEditForm } from '@/components/mentor-edit-form';
import { toast } from 'sonner';

export default function EditMentorPage({ params }: { params: { id: string } }) {
  const [mentor, setMentor] = useState(null);
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mentorData, techStacksData] = await Promise.all([
          getMentor(parseInt(params.id)),
          getTechStacks()
        ]);
        
        if (!mentorData) {
          toast.error('Mentor not found');
          router.push('/admin/mentors');
          return;
        }

        setMentor(mentorData);
        setTechStacks(techStacksData);
      } catch (error) {
        toast.error('Failed to load mentor data');
        router.push('/admin/mentors');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Mentor</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <MentorEditForm mentor={mentor} techStacks={techStacks} />
      </div>
    </div>
  );
}