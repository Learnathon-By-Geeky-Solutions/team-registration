import * as z from 'zod';

export const mentorSchema = z.object({
  fullName: z.string().min(2).max(50),
  techStack: z.string().min(1),
  githubUsername: z.string().min(1),
  linkedinUrl: z.string().url().optional(),
  maxTeamCapacity: z.number().min(1).max(10),
});

export type MentorFormData = z.infer<typeof mentorSchema>;