import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  status: z.enum(['lead', 'active', 'inactive']),
  notes: z.string().optional().or(z.literal('')),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const interactionSchema = z.object({
  type: z.enum(['call', 'email', 'meeting', 'other']),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  date: z.string().min(1, { message: 'Date is required' }),
  notes: z.string().optional().or(z.literal('')),
});

export type InteractionFormValues = z.infer<typeof interactionSchema>;

export const reminderSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
