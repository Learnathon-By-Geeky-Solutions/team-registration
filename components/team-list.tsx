'use client'

import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Team {
  id: number;
  team_name: string;
  tech_stack: string;
  created_at: string;
  mentor_name: string | null;
}

interface TeamListProps {
  teams: Team[];
  selectedTeamId: number | null;
  onTeamSelect: (team: Team) => void;
  onTeamUpdated: () => void;
}

export function TeamList({
  teams,
  selectedTeamId,
  onTeamSelect,
  onTeamUpdated
}: TeamListProps) {
  if (teams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No teams found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="divide-y divide-gray-200">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => onTeamSelect(team)}
            className={cn(
              'w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors',
              selectedTeamId === team.id && 'bg-blue-50 hover:bg-blue-50'
            )}
          >
            <div className="font-medium text-gray-900">{team.team_name}</div>
            <div className="text-sm text-gray-500 mt-1">
              {team.tech_stack} • {format(new Date(team.created_at), 'MMM d, yyyy')}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Mentor: {team.mentor_name || 'Unassigned'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}