'use server'

import { sql } from '@/lib/db';
import { hash } from 'bcryptjs';
import { AdminFormData } from '@/lib/validations/admin';

export async function createAdmin(data: AdminFormData) {
  try {
    const hashedPassword = await hash(data.password, 12);
    
    const result = await sql`
      INSERT INTO admins (email, password_hash, name)
      VALUES (${data.email}, ${hashedPassword}, ${data.name})
      RETURNING id
    `;
    
    return { success: true, adminId: result[0].id };
  } catch (error) {
    return { success: false, error: 'Failed to create admin' };
  }
}

export async function getAdmins() {
  try {
    const admins = await sql`
      SELECT id, email, name, created_at 
      FROM admins 
      ORDER BY created_at DESC
    `;
    return admins;
  } catch (error) {
    return [];
  }
}

export async function deleteAdmin(id: number) {
  try {
    const adminCount = await sql`SELECT COUNT(*) as count FROM admins`;
    if (adminCount[0].count <= 1) {
      return { success: false, error: 'Cannot delete the last admin' };
    }

    await sql`DELETE FROM admins WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete admin' };
  }
}