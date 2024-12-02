import { TeamRegistrationForm } from '@/components/team-registration-form';
import { getTechStacks } from '@/lib/actions/team';

export default async function RegisterPage() {
  const techStacks = await getTechStacks();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Team Registration</h1>
          <TeamRegistrationForm techStacks={techStacks} />
        </div>
      </div>
    </div>
  );
}