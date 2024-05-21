'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { z } from 'zod';
import { UseFormReset, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { _post } from '@/lib/api-client';
import { GoalData } from '@/models/goal.model';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskForm } from '@/models/task.model';

const AddTask = ({
  goal,
  getGoalInfo,
  size,
}: {
  goal: GoalData['_id'] | undefined;
  getGoalInfo: (goalId: string | undefined) => Promise<void>;
  size: 'small' | 'medium' | 'large';
}) => {
  const [creatingTask, setCreatingTask] = useState(false);

  const handleTaskCreation = async (
    reset: UseFormReset<TaskForm>,
    formData: z.infer<typeof taskFormSchema>
  ) => {
    try {
      setCreatingTask(true);
      const response = await _post(`tasks/${goal}`, {
        ...formData,
        quantity: parseInt(formData.quantity),
      });
      if (response) {
        await getGoalInfo(goal);
        reset();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingTask(false);
    }
  };

  const sizeClass: {
    small: string;
    medium: string;
    large: string;
  } = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-8 py-4 text-md',
    large: 'px-16 py-8 text-xl',
  };
  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button
          type='button'
          className={`${sizeClass[size]} font-medium rounded-lg`}>
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className='p-8 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Task</DialogTitle>
          <DialogDescription>
            Fill details and press Add Task button to add your task
          </DialogDescription>
        </DialogHeader>
        <AddGoalForm addTask={handleTaskCreation} creatingTask={creatingTask} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTask;

const taskFormSchema = z
  .object({
    name: z.string().min(3, {
      message: 'Please specify you task.',
    }),
    quantity: z.string({
      message: 'Please specify quantity.',
    }),
    frequency: z
      .enum(['once a week', 'twice a day', 'one day'])
      .default('once a week'),
    reminderTime: z.string().optional(),
    customReminder: z
      .object({
        days: z.number().array(),
        time: z.string().time(),
      })
      .optional(),
  })
  .required();

const DAYS = [
  {
    id: 0,
    label: 'Sunday',
  },
  {
    id: 1,
    label: 'Monday',
  },
  {
    id: 2,
    label: 'Tuesday',
  },
  {
    id: 3,
    label: 'Wednesday',
  },
  {
    id: 4,
    label: 'Thursday',
  },
  {
    id: 5,
    label: 'Friday',
  },
  {
    id: 6,
    label: 'Saturday',
  },
] as const;

const AddGoalForm = ({
  addTask,
  creatingTask,
}: {
  addTask: (
    reset: UseFormReset<TaskForm>,
    formData: z.infer<typeof taskFormSchema>
  ) => void;
  creatingTask: boolean;
}) => {
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: '',
      frequency: 'once a week',
      quantity: '',
      customReminder: {
        days: [0, 1, 2, 3, 4, 5, 6],
      },
    },
  });
  const { reset } = form;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formData) => addTask(reset, formData))}
        className='space-y-2'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='name'>Name</FormLabel>
              <FormControl>
                <Input
                  id='name'
                  placeholder='Enter title for your task'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='quantity'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='quantity'>Quantity</FormLabel>
              <FormControl>
                <Input type='text' id='quantity' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='frequency'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select an frequency' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='once a week'>Once a week</SelectItem>
                  <SelectItem value='twice a day'>Twice a day</SelectItem>
                  <SelectItem value='one day'>One day</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='reminderTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='reminderTime'>
                Choose reminder date and time
              </FormLabel>
              <FormControl>
                <Input
                  id='reminderTime'
                  type='datetime-local'
                  className='w-fit'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <p>Create custom reminder (optional)</p>
          <FormField
            control={form.control}
            name='customReminder.days'
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormLabel className='text-base'>Choose days</FormLabel>
                </div>
                {DAYS.map((day) => (
                  <FormField
                    key={day.id}
                    control={form.control}
                    name='customReminder.days'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day.id}
                          className='flex flex-row items-start space-x-3 space-y-0'>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, day.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== day.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='font-normal'>
                            {day.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='customReminder.time'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='customReminder.time'>Choose time</FormLabel>
                <FormDescription>
                  Provided format is 12hour in HH:MM:SS
                </FormDescription>
                <FormControl>
                  <Input
                    id='customReminder.time'
                    type='time'
                    className='w-fit'
                    step={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {!creatingTask ? (
          <Button type='submit'>Add Task</Button>
        ) : (
          <Button type='submit' variant='secondary' disabled={creatingTask}>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Please wait
          </Button>
        )}
      </form>
    </Form>
  );
};
