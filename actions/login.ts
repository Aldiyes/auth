'use server';

import { cookies } from 'next/headers';
import * as z from 'zod';

import { LoginSchema } from '@/schemas';

import db from '@/lib/db';
import { comparePassword } from '@/lib/passwordHasher';
import { createUserSession } from '@/lib/session';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid Fields!' };
	}

	const existingUser = await db.user.findFirst({
		where: {
			email: values.email,
		},
	});

	if (!existingUser) return { error: 'User not found in db' };

	const isCorrectPassword = await comparePassword({
		hashedPassword: existingUser.password,
		password: values.password,
		salt: existingUser.salt,
	});

	if (!isCorrectPassword) {
		return { error: 'Password incorect' };
	}

	await createUserSession(existingUser, await cookies());

	return { success: existingUser.username };
};
