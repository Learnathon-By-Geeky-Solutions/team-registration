import { MentorForm } from '@/components/mentor-form';
import { getTechStacks } from '@/lib/actions/team';

export default async function NewMentorPage() {
  const techStacks = await getTechStacks();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Mentor</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <MentorForm techStacks={techStacks} />
      </div>
    </div>
  );
}