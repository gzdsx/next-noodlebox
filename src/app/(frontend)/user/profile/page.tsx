import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/frontend/ProfileClient';

export default async function UserProfilePage() {
    const session = await auth();
    if (!session) redirect('/login');

    return <ProfileClient session={session}/>;
}
