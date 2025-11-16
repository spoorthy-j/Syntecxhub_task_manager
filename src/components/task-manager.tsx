'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Task, TaskPriority } from '@/lib/types';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { Button } from './ui/button';
import { PlusCircle, ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';

type SortBy = 'createdAt' | 'dueDate';
type SortDir = 'asc' | 'desc';

export function TaskManager({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const openForm = (task: Task | null = null) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingTask(null);
    setFormOpen(false);
  };

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'completed' ? task.completed : !task.completed);
        const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        const valA = a[sortBy] as any;
        const valB = b[sortBy] as any;

        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        
        let comparison = 0;
        if (valA < valB) comparison = -1;
        if (valA > valB) comparison = 1;
        
        return sortDir === 'asc' ? comparison : -comparison;
      });
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy, sortDir]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2 sm:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filter & Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={statusFilter === 'all'} onCheckedChange={() => setStatusFilter('all')}>All</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === 'pending'} onCheckedChange={() => setStatusFilter('pending')}>Pending</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === 'completed'} onCheckedChange={() => setStatusFilter('completed')}>Completed</DropdownMenuCheckboxItem>

              <DropdownMenuLabel className="mt-2">Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(['high', 'medium', 'low'] as TaskPriority[]).map(p => (
                <DropdownMenuCheckboxItem key={p} checked={priorityFilter.includes(p)} onCheckedChange={(checked) => setPriorityFilter(current => checked ? [...current, p] : current.filter(item => item !== p))}>
                  <span className="capitalize">{p}</span>
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuLabel className="mt-2">Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuCheckboxItem checked={sortBy === 'createdAt'} onCheckedChange={() => setSortBy('createdAt')}>Created Date</DropdownMenuCheckboxItem>
               <DropdownMenuCheckboxItem checked={sortBy === 'dueDate'} onCheckedChange={() => setSortBy('dueDate')}>Due Date</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
               <DropdownMenuCheckboxItem checked={sortDir === 'desc'} onCheckedChange={() => setSortDir('desc')}>Descending</DropdownMenuCheckboxItem>
               <DropdownMenuCheckboxItem checked={sortDir === 'asc'} onCheckedChange={() => setSortDir('asc')}>Ascending</DropdownMenuCheckboxItem>

            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => openForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {filteredAndSortedTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <TaskCard task={task} onEdit={() => openForm(task)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedTasks.length === 0 && (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
            <h3 className="text-xl font-semibold tracking-tight">No tasks found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or create a new task.
            </p>
         </div>
      )}

      <TaskForm open={isFormOpen} onOpenChange={setFormOpen} onFormSubmit={closeForm} task={editingTask} />
    </>
  );
}