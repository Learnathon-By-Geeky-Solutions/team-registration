'use server'

import { sql } from '@/lib/db';
import { MentorFormData } from '@/lib/validations/mentor';
import { parse } from 'csv-parse/sync';

export async function createMentor(data: MentorFormData) {
  try {
    const result = await sql`
      INSERT INTO mentors (
        full_name, tech_stack, github_username,
        linkedin_url, max_team_capacity
      ) VALUES (
        ${data.fullName}, ${data.techStack}, ${data.githubUsername},
        ${data.linkedinUrl}, ${data.maxTeamCapacity}
      ) RETURNING id
    `;
    return { success: true, mentorId: result[0].id };
  } catch (error) {
    return { success: false, error: 'Failed to create mentor' };
  }
}

export async function getMentor(id: number) {
  try {
    const result = await sql`
      SELECT * FROM mentors WHERE id = ${id}
    `;
    return result[0] || null;
  } catch (error) {
    return null;
  }
}

export async function updateMentor(id: number, data: MentorFormData) {
  try {
    await sql`
      UPDATE mentors SET
        full_name = ${data.fullName},
        tech_stack = ${data.techStack},
        github_username = ${data.githubUsername},
        linkedin_url = ${data.linkedinUrl},
        max_team_capacity = ${data.maxTeamCapacity}
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update mentor' };
  }
}

export async function createMentorsFromCsv(csvContent: string) {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let addedCount = 0;
    for (const record of records) {
      const mentor: MentorFormData = {
        fullName: record['Full Name'],
        techStack: record['Tech Stack'],
        githubUsername: record['GitHub Username'],
        linkedinUrl: record['LinkedIn URL'] || undefined,
        maxTeamCapacity: parseInt(record['Max Team Capacity']) || 3,
      };

      const result = await createMentor(mentor);
      if (result.success) addedCount++;
    }

    return { success: true, count: addedCount };
  } catch (error) {
    return { success: false, error: 'Failed to process CSV file' };
  }
}

export async function getMentors() {
  try {
    return await sql`
      SELECT * FROM mentors 
      ORDER BY created_at DESC
    `;
  } catch (error) {
    return [];
  }
}

export async function deleteMentor(id: number) {
  try {
    // Check if mentor has assigned teams
    const teamsCount = await sql`
      SELECT COUNT(*) as count FROM teams WHERE mentor_id = ${id}
    `;

    if (teamsCount[0].count > 0) {
      return { 
        success: false, 
        error: 'Cannot delete mentor with assigned teams' 
      };
    }

    await sql`DELETE FROM mentors WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete mentor' };
  }
}