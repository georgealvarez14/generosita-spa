"use server";

import { prisma } from '@/lib/prisma';

export async function syncUserProfile(
  user: { id: string; email: string; user_metadata?: any },
  options?: { nombre?: string; telefono?: string; password?: string }
) {
  try {
    const searchEmail = user.email;

    // Search by ID or Email to handle edge cases where Supabase Auth 
    // was recreated but the Prisma profile still exists.
    let profile = await prisma.cliente.findFirst({
      where: {
        OR: [
          { id: user.id },
          { email: searchEmail }
        ]
      }
    });

    if (!profile && searchEmail) {
      profile = await prisma.cliente.create({
        data: {
          id: user.id,
          email: searchEmail,
          nombre: options?.nombre || user.user_metadata?.full_name || searchEmail.split('@')[0],
          telefono: options?.telefono || user.user_metadata?.phone || '',
          rol: 'cliente',
          password: options?.password || '',
        }
      });
    } else if (profile && profile.id !== user.id) {
        // If the email matched but the ID is different, update the Prisma profile
        // so it syncs perfectly with the new Supabase Auth ID.
        profile = await prisma.cliente.update({
            where: { id: profile.id },
            data: { id: user.id }
        });
    }
    
    return { success: true, profile };
  } catch (error: any) {
    console.error("Error syncing profile to db:", error);
    return { success: false, error: error.message };
  }
}
