'use server'

import { sql } from '@/lib/db';
import { ConfigFormData } from '@/lib/validations/config';

export async function getConfig() {
  try {
    const result = await sql`
      SELECT * FROM platform_config 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    return result[0] || null;
  } catch (error) {
    return null;
  }
}

export async function updateConfig(data: ConfigFormData) {
  try {
    const result = await sql`
      INSERT INTO platform_config (
        github_token, organization_name, registration_open
      ) VALUES (
        ${data.githubToken}, ${data.organizationName}, ${data.registrationOpen}
      )
      ON CONFLICT ((id)) DO UPDATE SET
        github_token = ${data.githubToken},
        organization_name = ${data.organizationName},
        registration_open = ${data.registrationOpen},
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;
    return { success: true, configId: result[0].id };
  } catch (error) {
    return { success: false, error: 'Failed to update configuration' };
  }
}