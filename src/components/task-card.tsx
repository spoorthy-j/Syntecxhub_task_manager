'use client';

import { useTransition } from 'react';
import { deleteTask, updateTaskStatus } from '@/app/actions';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = (checked: boolean) => {
    startTransition(async () => {
      await updateTaskStatus(task.id, checked);
      toast({
        title: `Task ${checked ? 'completed' : 'marked as pending'}.`,
      });
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTask(task.id);
      toast({
        title: 'Task deleted.',
        variant: 'destructive',
      });
    });
  };

  const priorityVariants: Record<Task['priority'], 'destructive' | 'secondary' | 'outline'> = {
    high: 'destructive',
    medium: 'secondary',
    low: 'outline',
  };

  return (
    <Card className={cn('flex flex-col transition-all hover:shadow-lg', isPending && 'opacity-70')}>
      <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={handleStatusChange}
            disabled={isPending}
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="grid gap-1">
            <CardTitle className={cn('text-lg', task.completed && 'text-muted-foreground line-through')}>
              {task.title}
            </CardTitle>
          </div>
        </div>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent>
          <CardDescription className={cn(task.completed && 'line-through')}>
            {task.description}
          </CardDescription>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex items-center justify-between gap-2 pt-4">
        {task.dueDate ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
        ) : <div />}
        <Badge variant={priorityVariants[task.priority]} className="capitalize">
          {task.priority}
        </Badge>
      </CardFooter>
    </Card>
  );
}