'use server';

import { cookies } from 'next/headers';
import * as z from 'zod';

import { RegisterSchema } from '@/schemas';

import db from '@/lib/db';
import { generateSalt, hashPassword } from '@/lib/passwordHasher';
import { createUserSession } from '@/lib/session';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid Fields!' };
	}

	const existingUser = await db.user.findFirst({
		where: {
			email: values.email,
		},
	});

	if (existingUser !== null) return { error: 'Email already exists' };

	try {
		const salt = generateSalt();
		const hashedPassword = await hashPassword(values.password, salt);

		const newUser = await db.user.create({
			data: {
				...values,
				salt,
				password: hashedPassword,
			},
		});

		await createUserSession(newUser, await cookies());
		return { success: newUser.username };
	} catch (error) {
		return { error: 'Something went wrong' };
	}
};
