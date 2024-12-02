'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { teamSchema, type TeamFormData } from '@/lib/validations/team';
import { registerTeam } from '@/lib/actions/team';
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

interface TeamRegistrationFormProps {
  techStacks: string[];
}

export function TeamRegistrationForm({ techStacks }: TeamRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = 
    useForm<TeamFormData>({
      resolver: zodResolver(teamSchema),
    });

  const techStack = watch('techStack');

  const onSubmit = async (data: TeamFormData) => {
    setIsSubmitting(true);
    try {
      const result = await registerTeam(data);
      if (result.success) {
        const params = new URLSearchParams({
          mentorId: result.mentorId.toString(),
          ...(result.repoUrl && { repoUrl: result.repoUrl })
        });
        router.push(`/register/success?${params.toString()}`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to register team');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            {...register('teamName')}
            className={errors.teamName ? 'border-red-500' : ''}
          />
          {errors.teamName && (
            <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="techStack">Technology Stack</Label>
          <Select
            value={techStack}
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
          <Label htmlFor="pitchDeckUrl">Pitch Deck URL (Optional)</Label>
          <Input
            id="pitchDeckUrl"
            type="url"
            {...register('pitchDeckUrl')}
            className={errors.pitchDeckUrl ? 'border-red-500' : ''}
          />
          {errors.pitchDeckUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.pitchDeckUrl.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leaderName">Team Leader Name</Label>
            <Input
              id="leaderName"
              {...register('leaderName')}
              className={errors.leaderName ? 'border-red-500' : ''}
            />
            {errors.leaderName && (
              <p className="text-red-500 text-sm mt-1">{errors.leaderName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="leaderGithub">Team Leader GitHub</Label>
            <Input
              id="leaderGithub"
              {...register('leaderGithub')}
              className={errors.leaderGithub ? 'border-red-500' : ''}
            />
            {errors.leaderGithub && (
              <p className="text-red-500 text-sm mt-1">{errors.leaderGithub.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="member1Name">Team Member 1 Name</Label>
            <Input
              id="member1Name"
              {...register('member1Name')}
              className={errors.member1Name ? 'border-red-500' : ''}
            />
            {errors.member1Name && (
              <p className="text-red-500 text-sm mt-1">{errors.member1Name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="member1Github">Team Member 1 GitHub</Label>
            <Input
              id="member1Github"
              {...register('member1Github')}
              className={errors.member1Github ? 'border-red-500' : ''}
            />
            {errors.member1Github && (
              <p className="text-red-500 text-sm mt-1">{errors.member1Github.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="member2Name">Team Member 2 Name</Label>
            <Input
              id="member2Name"
              {...register('member2Name')}
              className={errors.member2Name ? 'border-red-500' : ''}
            />
            {errors.member2Name && (
              <p className="text-red-500 text-sm mt-1">{errors.member2Name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="member2Github">Team Member 2 GitHub</Label>
            <Input
              id="member2Github"
              {...register('member2Github')}
              className={errors.member2Github ? 'border-red-500' : ''}
            />
            {errors.member2Github && (
              <p className="text-red-500 text-sm mt-1">{errors.member2Github.message}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Registering...' : 'Register Team'}
      </Button>
    </form>
  );
}