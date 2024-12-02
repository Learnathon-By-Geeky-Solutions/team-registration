import * as z from 'zod';

export const teamSchema = z.object({
  teamName: z.string().min(3).max(50),
  techStack: z.string().min(1),
  pitchDeckUrl: z.string().url().optional(),
  leaderName: z.string().min(2).max(50),
  leaderGithub: z.string().min(1),
  member1Name: z.string().min(2).max(50),
  member1Github: z.string().min(1),
  member2Name: z.string().min(2).max(50),
  member2Github: z.string().min(1),
});

export type TeamFormData = z.infer<typeof teamSchema>;