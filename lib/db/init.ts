import { sql } from '@/lib/db';
import { hash } from 'bcryptjs';

export async function initializeDatabase() {
  try {
    // Create tables in separate transactions
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mentors (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        tech_stack VARCHAR(255) NOT NULL,
        github_username VARCHAR(255) NOT NULL UNIQUE,
        linkedin_url VARCHAR(255),
        max_team_capacity INTEGER NOT NULL DEFAULT 3,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL UNIQUE,
        tech_stack VARCHAR(255) NOT NULL,
        pitch_deck_url VARCHAR(255),
        leader_name VARCHAR(255) NOT NULL,
        leader_github VARCHAR(255) NOT NULL,
        member1_name VARCHAR(255) NOT NULL,
        member1_github VARCHAR(255) NOT NULL,
        member2_name VARCHAR(255) NOT NULL,
        member2_github VARCHAR(255) NOT NULL,
        mentor_id INTEGER REFERENCES mentors(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tech_stacks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS platform_config (
        id SERIAL PRIMARY KEY,
        github_token VARCHAR(255),
        organization_name VARCHAR(255),
        registration_open BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insert initial admin
    const initialAdminEmail = 'tanimul.haque@brainstation-23.com';
    const initialAdminPassword = 'Dhaka@23';
    const hashedPassword = await hash(initialAdminPassword, 12);

    await sql`
      INSERT INTO admins (email, password_hash, name)
      VALUES (${initialAdminEmail}, ${hashedPassword}, 'Admin')
      ON CONFLICT (email) DO NOTHING
    `;

    // Insert initial tech stacks
    const techStacks = ['.net', 'Java', 'PHP', 'Python', 'Mern', 'Unity', 'Cross-Platform'];
    
    for (const stack of techStacks) {
      await sql`
        INSERT INTO tech_stacks (name)
        VALUES (${stack})
        ON CONFLICT (name) DO NOTHING
      `;
    }

    // Insert initial platform configuration if not exists
    await sql`
      INSERT INTO platform_config (github_token, organization_name, registration_open)
      VALUES ('', 'BrainStation-23', true)
      ON CONFLICT DO NOTHING
    `;

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: String(error) };
  }
}