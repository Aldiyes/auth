'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { CardWrapper } from '@/components/auth/card-wrapper';
import { RegisterSchema } from '@/schemas';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const RegisterForm = () => {
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		console.log('[onSubmit - values]: ', values);
		toast.success('Register Success!');
	};

	return (
		<CardWrapper
			headerLabel="Create an account"
			backButtonLabel="Already have an account?"
			backButtonHref="/auth/login"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} placeholder="John Doe" type="text" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="john.doe@example.com"
											type="email"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} placeholder="******" type="password" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit" className="w-full">
						Register
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
