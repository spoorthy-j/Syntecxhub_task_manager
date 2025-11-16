import type { Task } from '@/lib/types';

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Q3 Report',
    description: 'Compile all team reports and create the final presentation for the board meeting.',
    priority: 'high',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Design new landing page',
    description: 'Create mockups for the new landing page based on the latest user feedback.',
    priority: 'medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: '3',
    title: 'Update dependencies',
    description: 'Update all npm packages to their latest stable versions.',
    priority: 'low',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    completed: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: '4',
    title: 'Brainstorm marketing campaign',
    priority: 'medium',
    completed: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: '5',
    title: 'Fix login button bug',
    description: 'The login button is not working on Safari. Investigate and fix.',
    priority: 'high',
    dueDate: new Date(),
    completed: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
  },
];