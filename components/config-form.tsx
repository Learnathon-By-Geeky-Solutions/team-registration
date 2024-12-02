'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { configSchema, type ConfigFormData } from '@/lib/validations/config';
import { updateConfig } from '@/lib/actions/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ConfigFormProps {
  initialData?: {
    github_token: string;
    organization_name: string;
    registration_open: boolean;
  } | null;
}

export function ConfigForm({ initialData }: ConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = 
    useForm<ConfigFormData>({
      resolver: zodResolver(configSchema),
      defaultValues: {
        githubToken: initialData?.github_token || '',
        organizationName: initialData?.organization_name || '',
        registrationOpen: initialData?.registration_open ?? true,
      },
    });

  const registrationOpen = watch('registrationOpen');

  const onSubmit = async (data: ConfigFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateConfig(data);
      if (result.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="githubToken">GitHub Access Token</Label>
        <Input
          id="githubToken"
          type="password"
          {...register('githubToken')}
          className={errors.githubToken ? 'border-red-500' : ''}
        />
        {errors.githubToken && (
          <p className="text-red-500 text-sm mt-1">{errors.githubToken.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input
          id="organizationName"
          {...register('organizationName')}
          className={errors.organizationName ? 'border-red-500' : ''}
        />
        {errors.organizationName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.organizationName.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="registrationOpen">Registration Status</Label>
        <Switch
          id="registrationOpen"
          checked={registrationOpen}
          onCheckedChange={(checked) => setValue('registrationOpen', checked)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  );
}