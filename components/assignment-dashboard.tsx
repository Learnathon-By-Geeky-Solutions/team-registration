'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Users, UserCheck, UserMinus } from 'lucide-react';

interface AssignmentStatus {
  unassignedTeams: number;
  totalTeams: number;
  totalMentors: number;
  totalCapacity: number;
}

interface AssignmentDashboardProps {
  initialStatus: AssignmentStatus | null;
}

export function AssignmentDashboard({ initialStatus }: AssignmentDashboardProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isAssigning, setIsAssigning] = useState(false);

  const refreshStatus = async () => {
    try {
      const response = await fetch('/api/assignments');
      const data = await response.json();
      if (response.ok) {
        setStatus(data);
      } else {
        toast.error('Failed to fetch assignment status');
      }
    } catch (error) {
      toast.error('Failed to fetch assignment status');
    }
  };

  const runAssignment = async () => {
    setIsAssigning(true);
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Mentor assignment completed');
        await refreshStatus();
      } else {
        toast.error('Failed to assign mentors');
      }
    } catch (error) {
      toast.error('Failed to assign mentors');
    } finally {
      setIsAssigning(false);
    }
  };

  if (!status) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.totalTeams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Teams</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status.totalTeams - status.unassignedTeams}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Teams</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.unassignedTeams}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mentor Capacity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Mentors:</span>
              <span className="font-bold">{status.totalMentors}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Capacity:</span>
              <span className="font-bold">{status.totalCapacity} teams</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={refreshStatus}>
          Refresh Status
        </Button>
        <Button 
          onClick={runAssignment} 
          disabled={isAssigning || status.unassignedTeams === 0}
        >
          {isAssigning ? 'Assigning...' : 'Run Assignment'}
        </Button>
      </div>
    </div>
  );
}