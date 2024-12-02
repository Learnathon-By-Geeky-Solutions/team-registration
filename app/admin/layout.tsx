import { getServerSession } from 'next-auth'
import ClientAdminLayout from './ClientAdminLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return <ClientAdminLayout session={session}>{children}</ClientAdminLayout>
}