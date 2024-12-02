'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMentor } from '@/lib/actions/mentor';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Linkedin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const [mentor, setMentor] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mentorId = searchParams.get('mentorId');
    const repoUrl = searchParams.get('repoUrl');

    if (repoUrl) {
      setRepoUrl(repoUrl);
    }

    const loadMentor = async () => {
      if (mentorId) {
        try {
          const mentorData = await getMentor(parseInt(mentorId));
          setMentor(mentorData);
        } catch (error) {
          toast.error('Failed to load mentor information');
        }
      }
      setIsLoading(false);
    };

    loadMentor();

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful! 🎉
          </h1>
          <p className="text-gray-600">
            Your team has been successfully registered and assigned a mentor.
          </p>
        </div>

        {mentor && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Mentor</h2>
            <div className="space-y-2">
              <p className="text-lg font-medium">{mentor.full_name}</p>
              <p className="text-gray-600">{mentor.tech_stack} Expert</p>
              <div className="flex justify-center space-x-4 mt-4">
                <a
                  href={`https://github.com/${mentor.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Github className="h-6 w-6" />
                </a>
                {mentor.linkedin_url && (
                  <a
                    href={mentor.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {repoUrl && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Project Repository</h2>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Github className="h-5 w-5" />
              View Repository
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
}