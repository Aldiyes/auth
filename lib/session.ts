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
const COOKIE_SESSION_KEY = 'session-id';

export const createUserSession = async (
	user: userSession,
	cookies: Pick<Cookies, 'set'>
) => {
	const sessionId = crypto.randomBytes(512).toString('hex').normalize();
	await db.session.create({
		data: {
			id: sessionId,
			userId: user.id,
			expiresAt: new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000),
		},
	});

	createCookie(sessionId, cookies);
};

export const getUserFromSession = (cookies: Pick<Cookies, 'get'>) => {
	const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
	if (sessionId == null) return null;

	return getUserSessionById(sessionId);
};

const getUserSessionById = async (sessionId: string) => {
	const session = await db.session.findUnique({
		where: { id: sessionId },
		include: { user: true },
	});

	const { success, data: user } = sessionSchema.safeParse(session?.user);

	return success ? user : null;
};

export const removeUserFormSession = async (
	cookies: Pick<Cookies, 'get' | 'delete'>
) => {
	const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;

	await db.session.delete({
		where: {
			id: sessionId,
		},
	});

	cookies.delete(COOKIE_SESSION_KEY);
};

const createCookie = async (data: string, cookies: Pick<Cookies, 'set'>) => {
	cookies.set(COOKIE_SESSION_KEY, data, {
		secure: true,
		httpOnly: true,
		sameSite: 'lax',
		expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
	});
};
