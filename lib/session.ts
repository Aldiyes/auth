import crypto from 'crypto';
import * as z from 'zod';

import db from '@/lib/db';
import { sessionSchema } from '@/schemas';

type userSession = z.infer<typeof sessionSchema>;

export type Cookies = {
	set: (
		key: string,
		value: string,
		options: {
			secure?: boolean;
			httpOnly?: boolean;
			sameSite?: 'strict' | 'lax';
			expires?: number;
		}
	) => void;
	get: (key: string) => { name: string; value: string } | undefined;
	delete: (key: string) => void;
};

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COKKIE_SESSION_KEY = 'session-id';

export const createUserSession = async (
	user: userSession,
	cookies: Pick<Cookies, 'set'>
) => {
	const sessionId = crypto.randomBytes(512).toString('hex').normalize();
	await db.user.update({
		where: {
			id: user.id,
		},
		data: {
			sessionId,
		},
	});

	createCookie(sessionId, cookies);
};

export const getUserFromSession = (cookies: Pick<Cookies, 'get'>) => {
	const sessionId = cookies.get(COKKIE_SESSION_KEY)?.value;
	if (sessionId == null) return null;

	return getUserSessionById(sessionId);
};

const getUserSessionById = async (sessionId: string) => {
	const currentUser = await db.user.findFirst({
		where: {
			sessionId,
		},
	});

	const { success, data: user } = sessionSchema.safeParse(currentUser);

	return success ? user : null;
};

const createCookie = async (data: string, cookies: Pick<Cookies, 'set'>) => {
	cookies.set(COKKIE_SESSION_KEY, data, {
		secure: true,
		httpOnly: true,
		sameSite: 'lax',
		expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
	});
};
