'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { mentorSchema, type MentorFormData } from '@/lib/validations/mentor';
import { createMentor } from '@/lib/actions/mentor';
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

interface MentorFormProps {
  techStacks: string[];
}

export function MentorForm({ techStacks }: MentorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = 
    useForm<MentorFormData>({
      resolver: zodResolver(mentorSchema),
    });

  const selectedTechStack = watch('techStack');

  const onSubmit = async (data: MentorFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createMentor(data);
      if (result.success) {
        toast.success('Mentor added successfully');
        router.push('/admin/mentors');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to add mentor');
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
          {isSubmitting ? 'Adding...' : 'Add Mentor'}
        </Button>
      </div>
    </form>
  );
}