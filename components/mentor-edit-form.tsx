'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { mentorSchema, type MentorFormData } from '@/lib/validations/mentor';
import { updateMentor } from '@/lib/actions/mentor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface MentorEditFormProps {
  mentor: {
    id: number;
    full_name: string;
    tech_stack: string;
    github_username: string;
    linkedin_url: string | null;
    max_team_capacity: number;
  };
  techStacks: string[];
}

export function MentorEditForm({ mentor, techStacks }: MentorEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = 
    useForm<MentorFormData>({
      resolver: zodResolver(mentorSchema),
      defaultValues: {
        fullName: mentor.full_name,
        techStack: mentor.tech_stack,
        githubUsername: mentor.github_username,
        linkedinUrl: mentor.linkedin_url || '',
        maxTeamCapacity: mentor.max_team_capacity,
      },
    });

  const selectedTechStack = watch('techStack');

  const onSubmit = async (data: MentorFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateMentor(mentor.id, data);
      if (result.success) {
        toast.success('Mentor updated successfully');
        router.push('/admin/mentors');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update mentor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...register('fullName')}
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="techStack">Technology Stack</Label>
        <Select
          value={selectedTechStack}
          onValueChange={(value) => setValue('techStack', value)}
        >
          <SelectTrigger className={errors.techStack ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a technology stack" />
          </SelectTrigger>
          <SelectContent>
            {techStacks.map((stack) => (
              <SelectItem key={stack} value={stack}>
                {stack}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.techStack && (
          <p className="text-red-500 text-sm mt-1">{errors.techStack.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="githubUsername">GitHub Username</Label>
        <Input
          id="githubUsername"
          {...register('githubUsername')}
          className={errors.githubUsername ? 'border-red-500' : ''}
        />
        {errors.githubUsername && (
          <p className="text-red-500 text-sm mt-1">{errors.githubUsername.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
        <Input
          id="linkedinUrl"
          type="url"
          {...register('linkedinUrl')}
          className={errors.linkedinUrl ? 'border-red-500' : ''}
        />
        {errors.linkedinUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.linkedinUrl.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="maxTeamCapacity">Maximum Team Capacity</Label>
        <Input
          id="maxTeamCapacity"
          type="number"
          min="1"
          max="10"
          {...register('maxTeamCapacity', { valueAsNumber: true })}
          className={errors.maxTeamCapacity ? 'border-red-500' : ''}
        />
        {errors.maxTeamCapacity && (
          <p className="text-red-500 text-sm mt-1">{errors.maxTeamCapacity.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/mentors')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}