import * as z from 'zod';

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z
		.string({
			message: 'Password is required',
		})
		.min(6, {
			message: 'Password must contain at least 6 character(s)',
		}),
});

export const RegisterSchema = z.object({
	username: z.string().min(1, {
		message: 'Name is required',
	}),
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(6, {
		message: 'Minimum 6 characters required',
	}),
});

export const sessionSchema = z.object({
	id: z.string(),
	role: z.enum(['admin', 'user']),
});
