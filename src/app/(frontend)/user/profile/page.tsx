import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/frontend/ProfileClient';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Profile - The Best Chinese Takeaway In Drogheda',
}

export default async function UserProfilePage() {
    const session = await auth();
    if (!session) redirect('/login?redirect=/user/profile');

    return <ProfileClient session={session}/>;
}
