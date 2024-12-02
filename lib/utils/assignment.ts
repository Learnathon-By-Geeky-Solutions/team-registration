import { sql } from '@/lib/db';

interface Mentor {
  id: number;
  tech_stack: string;
  max_team_capacity: number;
}

interface Team {
  id: number;
  tech_stack: string;
  mentor_id: number | null;
}

export async function assignMentorsToTeams() {
  try {
    // Get all unassigned teams
    const unassignedTeams = await sql<Team[]>`
      SELECT id, tech_stack, mentor_id 
      FROM teams 
      WHERE mentor_id IS NULL
      ORDER BY created_at ASC
    `;

    // Get all mentors with their current team counts
    const mentorsWithCounts = await sql<(Mentor & { team_count: number })[]>`
      SELECT 
        m.id, 
        m.tech_stack, 
        m.max_team_capacity,
        COUNT(t.id) as team_count
      FROM mentors m
      LEFT JOIN teams t ON t.mentor_id = m.id
      GROUP BY m.id
      ORDER BY team_count ASC
    `;

    for (const team of unassignedTeams) {
      // Find eligible mentors (matching tech stack and not at capacity)
      const eligibleMentors = mentorsWithCounts.filter(mentor => 
        mentor.tech_stack === team.tech_stack && 
        mentor.team_count < mentor.max_team_capacity
      );

      if (eligibleMentors.length > 0) {
        // Sort by team count to implement round-robin
        eligibleMentors.sort((a, b) => a.team_count - b.team_count);
        const selectedMentor = eligibleMentors[0];

        // Assign mentor to team
        await sql`
          UPDATE teams 
          SET mentor_id = ${selectedMentor.id} 
          WHERE id = ${team.id}
        `;

        // Update local count
        selectedMentor.team_count++;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in mentor assignment:', error);
    return { success: false, error: 'Failed to assign mentors' };
  }
}

export async function getAssignmentStatus() {
  try {
    const [unassignedCount, totalTeams, mentorCapacity] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM teams WHERE mentor_id IS NULL`,
      sql`SELECT COUNT(*) as count FROM teams`,
      sql`
        SELECT 
          SUM(max_team_capacity) as total_capacity,
          COUNT(*) as mentor_count
        FROM mentors
      `
    ]);

    return {
      success: true,
      data: {
        unassignedTeams: unassignedCount[0].count,
        totalTeams: totalTeams[0].count,
        totalMentors: mentorCapacity[0].mentor_count,
        totalCapacity: mentorCapacity[0].total_capacity
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to get assignment status' 
    };
  }
}