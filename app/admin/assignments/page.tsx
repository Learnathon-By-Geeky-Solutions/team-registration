import { getAssignmentStatus } from '@/lib/utils/assignment';
import { AssignmentDashboard } from '@/components/assignment-dashboard';

export default async function AssignmentsPage() {
  const status = await getAssignmentStatus();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mentor Assignments</h1>
      {
        //@ts-ignore
        <AssignmentDashboard initialStatus={status.success ? status.data : null} />}
    </div>
  );
}