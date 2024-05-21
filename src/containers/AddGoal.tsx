'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { z } from 'zod';
import { addDays, format } from 'date-fns';
import { useForm } from 'react-hook-form';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { _post } from '@/lib/api-client';
import { UserData } from '@/models/user.model';

const AddGoal = ({
  user,
  getUserInfo,
  size,
}: {
  user: UserData['_id'] | undefined;
  getUserInfo: () => Promise<void>;
  size: 'small' | 'medium' | 'large';
}) => {
  const [creatingGoal, setCreatingGoal] = useState(false);

  const handleGoalCreation = async (
    formData: z.infer<typeof goalFormSchema>
  ) => {
    try {
      setCreatingGoal(true);
      const response = await _post(`goals/${user}`, {
        name: formData.goalName,
        minTimeLine: formData.date.from.toISOString(),
        maxTimeLine: formData.date.to.toISOString(),
      });
      if (response) await getUserInfo();
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingGoal(false);
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
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className='p-8 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Goal</DialogTitle>
          <DialogDescription>
            Fill details and press Add Goal button to add your goal
          </DialogDescription>
        </DialogHeader>
        <AddGoalForm addGoal={handleGoalCreation} creatingGoal={creatingGoal} />
      </DialogContent>
    </Dialog>
  );
};

export default AddGoal;

const goalFormSchema = z
  .object({
    goalName: z.string().min(3, {
      message: 'Please specify you goal.',
    }),
    date: z.object({
      from: z.date(),
      to: z.date(),
    }),
  })
  .required()
  .refine((data) => data.date.from > addDays(new Date(), -1), {
    message: 'Start date must be in furture.',
    path: ['date'],
  });

const AddGoalForm = ({
  addGoal,
  creatingGoal,
}: {
  addGoal: (formData: z.infer<typeof goalFormSchema>) => void;
  creatingGoal: boolean;
}) => {
  const form = useForm<z.infer<typeof goalFormSchema>>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      goalName: '',
    },
  });
  const { reset } = form;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addGoal)} className='space-y-6'>
        <FormField
          control={form.control}
          name='goalName'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor='goalname'>Name</FormLabel>
              <FormControl>
                <Input
                  id='goalName'
                  placeholder='Enter title for your goal'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose dates for your goal</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='date'
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, 'LLL dd, y')} -{' '}
                            {format(field.value.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(field.value.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      initialFocus
                      mode='range'
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                Select the start date and end date for your goal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {!creatingGoal ? (
          <Button type='submit'>Add Goal</Button>
        ) : (
          <Button type='submit' variant='secondary' disabled={creatingGoal}>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Please wait
          </Button>
        )}
      </form>
    </Form>
  );
};
