'use server'

import { sql } from '@/lib/db';

export async function getTechStacks() {
  try {
    const stacks = await sql`SELECT name FROM tech_stacks ORDER BY name`;
    return stacks.map(stack => stack.name);
  } catch (error) {
    return [];
  }
}

export async function addTechStack(name: string) {
  try {
    await sql`
      INSERT INTO tech_stacks (name)
      VALUES (${name})
    `;
    return { success: true };
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return { success: false, error: 'This technology stack already exists' };
    }
    return { success: false, error: 'Failed to add technology stack' };
  }
}

export async function deleteTechStack(name: string) {
  try {
    // Check if the stack is in use by any teams or mentors
    const [teamsCount, mentorsCount] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM teams WHERE tech_stack = ${name}`,
      sql`SELECT COUNT(*) as count FROM mentors WHERE tech_stack = ${name}`
    ]);

    if (teamsCount[0].count > 0 || mentorsCount[0].count > 0) {
      return { 
        success: false, 
        error: 'Cannot delete this stack as it is being used by teams or mentors' 
      };
    }

    await sql`DELETE FROM tech_stacks WHERE name = ${name}`;
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete technology stack' };
  }
}