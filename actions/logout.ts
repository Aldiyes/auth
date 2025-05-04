'use server';

import { removeUserFormSession } from '@/lib/session';
import { cookies } from 'next/headers';

export const logout = async () => {
	await removeUserFormSession(await cookies());
};
