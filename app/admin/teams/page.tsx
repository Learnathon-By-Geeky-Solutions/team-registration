'use client'

import { useState, useEffect } from 'react';
import { getTeams } from '@/lib/actions/team';
import { TeamList } from '@/components/team-list';
import { TeamDetails } from '@/components/team-details';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      toast.error('Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams = teams.filter(team => 
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadCsv = () => {
    const headers = [
      'Team Name',
      'Tech Stack',
      'Pitch Deck URL',
      'Leader Name',
      'Leader GitHub',
      'Member 1 Name',
      'Member 1 GitHub',
      'Member 2 Name',
      'Member 2 GitHub',
      'Mentor Name',
      'Registration Date'
    ];

    const csvData = teams.map(team => [
      team.team_name,
      team.tech_stack,
      team.pitch_deck_url || '',
      team.leader_name,
      team.leader_github,
      team.member1_name,
      team.member1_github,
      team.member2_name,
      team.member2_github,
      team.mentor_name || 'Unassigned',
      new Date(team.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teams.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div>Loading teams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Registered Teams</h1>
        <Button
          variant="outline"
          onClick={downloadCsv}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-1/3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <TeamList
            teams={filteredTeams}
            selectedTeamId={selectedTeam?.id}
            onTeamSelect={setSelectedTeam}
            onTeamUpdated={loadTeams}
          />
        </div>
        <div className="w-2/3">
          {selectedTeam ? (
            <TeamDetails
              team={selectedTeam}
              onTeamUpdated={loadTeams}
              onTeamDeleted={() => {
                setSelectedTeam(null);
                loadTeams();
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              Select a team to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}