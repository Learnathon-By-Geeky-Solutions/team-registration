import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL);

export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS mentors (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      tech_stack VARCHAR(255) NOT NULL,
      github_username VARCHAR(255) NOT NULL UNIQUE,
      linkedin_url VARCHAR(255),
      max_team_capacity INTEGER NOT NULL DEFAULT 3,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

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
    );

    CREATE TABLE IF NOT EXISTS tech_stacks (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS platform_config (
      id SERIAL PRIMARY KEY,
      github_token VARCHAR(255),
      organization_name VARCHAR(255),
      registration_open BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}