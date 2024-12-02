import * as z from 'zod';

export const configSchema = z.object({
  githubToken: z.string().min(1, 'GitHub token is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  registrationOpen: z.boolean(),
});

export type ConfigFormData = z.infer<typeof configSchema>;