'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Task, TaskPriority } from '@/lib/types';
import { initialTasks } from '@/lib/data';

// In-memory store for tasks, simulating a database.
let tasks: Task[] = [...initialTasks];

// --- AUTH ACTIONS ---

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { message: 'Invalid email or password format.' };
  }

  // In a real app, you would validate credentials against a database.
  // For this demo, we'll accept any valid email/password.

  cookies().set('session', 'mock-session-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });

  redirect('/tasks');
}

export async function logout() {
  cookies().delete('session');
  redirect('/');
}

// --- TASK ACTIONS ---

export async function getTasks(): Promise<Task[]> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 500));
  return tasks;
}

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

export async function createTask(formData: FormData) {
  const parsed = taskSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    // This should be handled more gracefully in a real app
    throw new Error('Invalid task data.');
  }

  const newTask: Task = {
    id: Date.now().toString(),
    ...parsed.data,
    priority: parsed.data.priority as TaskPriority,
    completed: false,
    createdAt: new Date(),
  };

  tasks.unshift(newTask);
  revalidatePath('/tasks');
  return { success: true };
}

export async function updateTask(taskId: string, formData: FormData) {
  const parsed = taskSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error('Invalid task data.');
  }

  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, ...parsed.data, priority: parsed.data.priority as TaskPriority } : task
  );

  revalidatePath('/tasks');
  return { success: true };
}

export async function deleteTask(taskId: string) {
  tasks = tasks.filter((task) => task.id !== taskId);
  revalidatePath('/tasks');
  return { success: true };
}

export async function updateTaskStatus(taskId: string, completed: boolean) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed } : task
  );
  revalidatePath('/tasks');
  return { success: true };
}